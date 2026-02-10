import { OrderStatus } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

const SALES_STATUSES: OrderStatus[] = [
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
];

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const addMonths = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

export type SalesReportParams = {
  storeId?: string;
  month: string;
};

export async function getSalesReport(params: SalesReportParams) {
  const [year, monthValue] = params.month.split("-").map(Number);
  const monthStart = new Date(year, monthValue - 1, 1);
  const monthEnd = new Date(year, monthValue, 1);

  const chartStart = addMonths(monthStart, -5);
  const months: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    months.push(monthKey(addMonths(chartStart, i)));
  }

  const orderWhere = {
    storeId: params.storeId,
    status: { in: SALES_STATUSES },
  };

  const orders = await prisma.order.findMany({
    where: {
      ...orderWhere,
      createdAt: { gte: chartStart, lt: monthEnd },
    },
    select: { totalAmount: true, createdAt: true },
  });

  const monthlyTotals = new Map<string, number>();
  for (const key of months) {
    monthlyTotals.set(key, 0);
  }
  for (const order of orders) {
    const key = monthKey(order.createdAt);
    const current = monthlyTotals.get(key);
    if (current === undefined) continue;
    monthlyTotals.set(key, current + Number(order.totalAmount));
  }

  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: {
        ...orderWhere,
        createdAt: { gte: monthStart, lt: monthEnd },
      },
    },
    select: {
      quantity: true,
      subtotal: true,
      product: {
        select: {
          id: true,
          name: true,
          category: { select: { id: true, name: true } },
        },
      },
    },
  });

  let totalSales = 0;
  const categoryMap = new Map<
    string,
    { categoryId: string; categoryName: string; totalSales: number }
  >();
  const productMap = new Map<
    string,
    {
      productId: string;
      productName: string;
      categoryName: string;
      quantity: number;
      totalSales: number;
    }
  >();

  for (const item of orderItems) {
    const lineTotal = Number(item.subtotal);
    totalSales += lineTotal;

    const categoryId = item.product.category?.id || "uncategorized";
    const categoryName = item.product.category?.name || "Uncategorized";
    const categoryEntry = categoryMap.get(categoryId) || {
      categoryId,
      categoryName,
      totalSales: 0,
    };
    categoryEntry.totalSales += lineTotal;
    categoryMap.set(categoryId, categoryEntry);

    const productEntry = productMap.get(item.product.id) || {
      productId: item.product.id,
      productName: item.product.name,
      categoryName,
      quantity: 0,
      totalSales: 0,
    };
    productEntry.quantity += item.quantity;
    productEntry.totalSales += lineTotal;
    productMap.set(item.product.id, productEntry);
  }

  const categories: Array<{
    categoryId: string;
    categoryName: string;
    totalSales: number;
    percentage: number;
  }> = [];
  for (const entry of categoryMap.values()) {
    let percentage = 0;
    if (totalSales > 0) {
      percentage = Math.round((entry.totalSales / totalSales) * 100);
    }
    categories.push({ ...entry, percentage });
  }

  const products = Array.from(productMap.values());

  const monthlySeries: Array<{ month: string; totalSales: number }> = [];
  for (const key of months) {
    monthlySeries.push({
      month: key,
      totalSales: monthlyTotals.get(key) || 0,
    });
  }

  return {
    month: params.month,
    summary: {
      totalSales,
      categoryCount: categories.length,
      productCount: products.length,
    },
    monthlySeries,
    categories,
    products,
  };
}
