import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";

export type DiscountListParams = {
  page: number;
  limit: number;
  search?: string;
  storeId?: string;
};

export async function listAdminDiscounts(params: DiscountListParams) {
  const where: Prisma.DiscountWhereInput = {};
  if (params.storeId) where.storeId = params.storeId;
  if (params.search) {
    where.product = {
      name: { contains: params.search, mode: Prisma.QueryMode.insensitive },
    };
  }

  const skip = (params.page - 1) * params.limit;
  const take = params.limit;

  const [items, total] = await prisma.$transaction([
    prisma.discount.findMany({
      where,
      include: {
        store: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
      orderBy: { startAt: "desc" },
      skip,
      take,
    }),
    prisma.discount.count({ where }),
  ]);

  const discounts = items.map((item) => ({
    id: item.id,
    storeId: item.storeId,
    storeName: item.store.name,
    productId: item.productId,
    productName: item.product.name,
    rule: item.rule,
    type: item.type,
    value: Number(item.value),
    minPurchase: item.minPurchase ? Number(item.minPurchase) : null,
    maxDiscount: item.maxDiscount ? Number(item.maxDiscount) : null,
    startAt: item.startAt,
    endAt: item.endAt,
  }));

  return {
    discounts,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    },
  };
}

export async function listDiscountProducts(storeId: string) {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { id: true },
  });
  if (!store) throw createCustomError(404, "storeId");

  const stocks = await prisma.productStock.findMany({
    where: { storeId },
    include: { product: { select: { id: true, name: true } } },
    orderBy: { product: { name: "asc" } },
  });

  return stocks.map((item) => ({
    id: item.product.id,
    name: item.product.name,
  }));
}
