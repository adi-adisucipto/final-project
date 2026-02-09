import { prisma } from "../lib/prisma";
import { Prisma, StockAction } from "../generated/prisma/client";
import { createCustomError } from "../utils/customError";

export type InventoryListParams = {
  page: number;
  limit: number;
  search?: string;
  storeId?: string;
};

export type InventoryAdjustParams = {
  storeId: string;
  productId: string;
  action: StockAction;
  quantity: number;
  note?: string;
};

const lowStockThreshold = 5;

const buildWhere = (params: InventoryListParams): Prisma.ProductStockWhereInput => {
  const where: Prisma.ProductStockWhereInput = {};
  if (params.storeId) where.storeId = params.storeId;
  if (params.search) {
    where.product = {
      name: { contains: params.search, mode: Prisma.QueryMode.insensitive },
    };
  }
  return where;
};

const buildPagination = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

export async function listInventory(params: InventoryListParams) {
  const where = buildWhere(params);
  const skip = (params.page - 1) * params.limit;
  const [items, total, totalUnits, lowStock] = await prisma.$transaction([
    prisma.productStock.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: { product: { name: "asc" } },
      include: {
        product: { select: { id: true, name: true } },
        store: { select: { id: true, name: true } },
        journals: { take: 1, orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.productStock.count({ where }),
    prisma.productStock.aggregate({
      where,
      _sum: { quantity: true },
    }),
    prisma.productStock.count({
      where: { ...where, quantity: { lte: lowStockThreshold } },
    }),
  ]);

  const recentChanges = await prisma.stockJournal.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    where: params.storeId
      ? { productStock: { storeId: params.storeId } }
      : undefined,
    include: {
      productStock: {
        include: {
          product: { select: { id: true, name: true } },
          store: { select: { id: true, name: true } },
        },
      },
    },
  });

  const stocks = items.map((item) => ({
    id: item.id,
    productId: item.product.id,
    productName: item.product.name,
    storeId: item.store.id,
    storeName: item.store.name,
    quantity: item.quantity,
    lastUpdated: item.journals[0]?.createdAt || null,
  }));

  const history = recentChanges.map((entry) => ({
    id: entry.id,
    productId: entry.productStock.productId,
    productName: entry.productStock.product.name,
    storeId: entry.productStock.storeId,
    storeName: entry.productStock.store.name,
    action: entry.action,
    quantity: entry.quantity,
    note: entry.note || "",
    createdAt: entry.createdAt,
  }));

  return {
    stocks,
    pagination: buildPagination(params.page, params.limit, total),
    stats: {
      totalProducts: total,
      totalUnits: totalUnits._sum.quantity || 0,
      lowStock,
    },
    history,
  };
}

const ensureStore = async (storeId: string) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { id: true },
  });
  if (!store) throw createCustomError(404, "storeId");
};

const ensureProduct = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) throw createCustomError(404, "productId");
};

const getOrCreateStock = async (storeId: string, productId: string) => {
  const existing = await prisma.productStock.findUnique({
    where: { productId_storeId: { productId, storeId } },
  });
  if (existing) return existing;
  return prisma.productStock.create({
    data: { storeId, productId, quantity: 0 },
  });
};

export async function adjustInventory(params: InventoryAdjustParams) {
  await ensureStore(params.storeId);
  await ensureProduct(params.productId);

  const stock = await getOrCreateStock(params.storeId, params.productId);
  const change = params.action === "IN" ? params.quantity : -params.quantity;
  const nextQuantity = stock.quantity + change;
  if (nextQuantity < 0) throw createCustomError(400, "stock");

  const [updated] = await prisma.$transaction([
    prisma.productStock.update({
      where: { id: stock.id },
      data: { quantity: nextQuantity },
    }),
    prisma.stockJournal.create({
      data: {
        productStockId: stock.id,
        action: params.action,
        quantity: params.quantity,
        note: params.note,
      },
    }),
  ]);

  return { id: updated.id, quantity: updated.quantity };
}

export async function deleteInventory(stockId: string) {
  await prisma.productStock.delete({ where: { id: stockId } });
}

export async function listInventoryProducts(search?: string) {
  const where: Prisma.ProductWhereInput = {};
  if (search) {
    where.name = { contains: search, mode: Prisma.QueryMode.insensitive };
  }
  const items = await prisma.product.findMany({
    where,
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return items;
}
