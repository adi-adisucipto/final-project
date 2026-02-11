"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listInventory = listInventory;
exports.adjustInventory = adjustInventory;
exports.deleteInventory = deleteInventory;
exports.listInventoryProducts = listInventoryProducts;
const prisma_1 = require("../lib/prisma");
const client_1 = require("../generated/prisma/client");
const customError_1 = require("../utils/customError");
const lowStockThreshold = 5;
const buildWhere = (params) => {
    const where = {};
    if (params.storeId)
        where.storeId = params.storeId;
    if (params.search) {
        where.product = {
            name: { contains: params.search, mode: client_1.Prisma.QueryMode.insensitive },
        };
    }
    return where;
};
const buildPagination = (page, limit, total) => ({
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
});
async function listInventory(params) {
    const where = buildWhere(params);
    const skip = (params.page - 1) * params.limit;
    const [items, total, totalUnits, lowStock] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.productStock.findMany({
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
        prisma_1.prisma.productStock.count({ where }),
        prisma_1.prisma.productStock.aggregate({
            where,
            _sum: { quantity: true },
        }),
        prisma_1.prisma.productStock.count({
            where: { ...where, quantity: { lte: lowStockThreshold } },
        }),
    ]);
    const recentChanges = await prisma_1.prisma.stockJournal.findMany({
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
const ensureStore = async (storeId) => {
    const store = await prisma_1.prisma.store.findUnique({
        where: { id: storeId },
        select: { id: true },
    });
    if (!store)
        throw (0, customError_1.createCustomError)(404, "storeId");
};
const ensureProduct = async (productId) => {
    const product = await prisma_1.prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
    });
    if (!product)
        throw (0, customError_1.createCustomError)(404, "productId");
};
const getOrCreateStock = async (storeId, productId) => {
    const existing = await prisma_1.prisma.productStock.findUnique({
        where: { productId_storeId: { productId, storeId } },
    });
    if (existing)
        return existing;
    return prisma_1.prisma.productStock.create({
        data: { storeId, productId, quantity: 0 },
    });
};
async function adjustInventory(params) {
    await ensureStore(params.storeId);
    await ensureProduct(params.productId);
    const stock = await getOrCreateStock(params.storeId, params.productId);
    const change = params.action === "IN" ? params.quantity : -params.quantity;
    const nextQuantity = stock.quantity + change;
    if (nextQuantity < 0)
        throw (0, customError_1.createCustomError)(400, "stock");
    const [updated] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.productStock.update({
            where: { id: stock.id },
            data: { quantity: nextQuantity },
        }),
        prisma_1.prisma.stockJournal.create({
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
async function deleteInventory(stockId) {
    await prisma_1.prisma.productStock.delete({ where: { id: stockId } });
}
async function listInventoryProducts(search) {
    const where = {};
    if (search) {
        where.name = { contains: search, mode: client_1.Prisma.QueryMode.insensitive };
    }
    const items = await prisma_1.prisma.product.findMany({
        where,
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });
    return items;
}
