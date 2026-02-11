"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesReport = getSalesReport;
const prisma_1 = require("../lib/prisma");
const SALES_STATUSES = [
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
];
const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
const addMonths = (date, amount) => new Date(date.getFullYear(), date.getMonth() + amount, 1);
async function getSalesReport(params) {
    const [year, monthValue] = params.month.split("-").map(Number);
    const monthStart = new Date(year, monthValue - 1, 1);
    const monthEnd = new Date(year, monthValue, 1);
    const chartStart = addMonths(monthStart, -5);
    const months = [];
    for (let i = 0; i < 6; i += 1) {
        months.push(monthKey(addMonths(chartStart, i)));
    }
    const orderWhere = {
        storeId: params.storeId,
        status: { in: SALES_STATUSES },
    };
    const orders = await prisma_1.prisma.order.findMany({
        where: {
            ...orderWhere,
            createdAt: { gte: chartStart, lt: monthEnd },
        },
        select: { totalAmount: true, createdAt: true },
    });
    const monthlyTotals = new Map();
    for (const key of months) {
        monthlyTotals.set(key, 0);
    }
    for (const order of orders) {
        const key = monthKey(order.createdAt);
        const current = monthlyTotals.get(key);
        if (current === undefined)
            continue;
        monthlyTotals.set(key, current + Number(order.totalAmount));
    }
    const orderItems = await prisma_1.prisma.orderItem.findMany({
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
    const categoryMap = new Map();
    const productMap = new Map();
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
    const categories = [];
    for (const entry of categoryMap.values()) {
        let percentage = 0;
        if (totalSales > 0) {
            percentage = Math.round((entry.totalSales / totalSales) * 100);
        }
        categories.push({ ...entry, percentage });
    }
    const products = Array.from(productMap.values());
    const monthlySeries = [];
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
