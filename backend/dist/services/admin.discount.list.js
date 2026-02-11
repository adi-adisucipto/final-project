"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAdminDiscounts = listAdminDiscounts;
exports.listDiscountProducts = listDiscountProducts;
const client_1 = require("../generated/prisma/client");
const prisma_1 = require("../lib/prisma");
const customError_1 = require("../utils/customError");
async function listAdminDiscounts(params) {
    const where = {};
    if (params.storeId)
        where.storeId = params.storeId;
    if (params.search) {
        where.product = {
            name: { contains: params.search, mode: client_1.Prisma.QueryMode.insensitive },
        };
    }
    const skip = (params.page - 1) * params.limit;
    const take = params.limit;
    const [items, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.discount.findMany({
            where,
            include: {
                store: { select: { id: true, name: true } },
                product: { select: { id: true, name: true } },
            },
            orderBy: { startAt: "desc" },
            skip,
            take,
        }),
        prisma_1.prisma.discount.count({ where }),
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
async function listDiscountProducts(storeId) {
    const store = await prisma_1.prisma.store.findUnique({
        where: { id: storeId },
        select: { id: true },
    });
    if (!store)
        throw (0, customError_1.createCustomError)(404, "storeId");
    const stocks = await prisma_1.prisma.productStock.findMany({
        where: { storeId },
        include: { product: { select: { id: true, name: true } } },
        orderBy: { product: { name: "asc" } },
    });
    return stocks.map((item) => ({
        id: item.product.id,
        name: item.product.name,
    }));
}
