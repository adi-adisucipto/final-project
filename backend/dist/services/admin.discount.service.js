"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminDiscount = createAdminDiscount;
exports.updateAdminDiscount = updateAdminDiscount;
exports.deleteAdminDiscount = deleteAdminDiscount;
const prisma_1 = require("../lib/prisma");
const customError_1 = require("../utils/customError");
const getEndDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
};
async function createAdminDiscount(payload) {
    if (!payload.storeId)
        throw (0, customError_1.createCustomError)(400, "storeId");
    if (!payload.productId)
        throw (0, customError_1.createCustomError)(400, "productId");
    let rule = payload.rule;
    let type = payload.type;
    let value = payload.value;
    let minPurchase = payload.minPurchase;
    let maxDiscount = payload.maxDiscount;
    if (rule === "BOGO") {
        type = "NOMINAL";
        value = 0;
        minPurchase = undefined;
        maxDiscount = undefined;
    }
    else {
        if (!value || value <= 0)
            throw (0, customError_1.createCustomError)(400, "value");
        if (type === "PERCENT" && value > 100) {
            throw (0, customError_1.createCustomError)(400, "value");
        }
    }
    if (rule === "MIN_PURCHASE") {
        if (!minPurchase || minPurchase <= 0) {
            throw (0, customError_1.createCustomError)(400, "minPurchase");
        }
        if (!maxDiscount || maxDiscount <= 0) {
            throw (0, customError_1.createCustomError)(400, "maxDiscount");
        }
    }
    else {
        minPurchase = undefined;
        maxDiscount = undefined;
    }
    const store = await prisma_1.prisma.store.findUnique({
        where: { id: payload.storeId },
        select: { id: true },
    });
    if (!store)
        throw (0, customError_1.createCustomError)(404, "storeId");
    const product = await prisma_1.prisma.product.findUnique({
        where: { id: payload.productId },
        select: { id: true },
    });
    if (!product)
        throw (0, customError_1.createCustomError)(404, "productId");
    const stock = await prisma_1.prisma.productStock.findUnique({
        where: {
            productId_storeId: {
                productId: payload.productId,
                storeId: payload.storeId,
            },
        },
        select: { id: true },
    });
    if (!stock)
        throw (0, customError_1.createCustomError)(400, "productId");
    const discount = await prisma_1.prisma.discount.create({
        data: {
            storeId: payload.storeId,
            productId: payload.productId,
            rule,
            type,
            value,
            minPurchase,
            maxDiscount,
            startAt: new Date(),
            endAt: getEndDate(),
        },
    });
    return discount.id;
}
async function updateAdminDiscount(discountId, payload) {
    const discount = await prisma_1.prisma.discount.findUnique({
        where: { id: discountId },
    });
    if (!discount)
        throw (0, customError_1.createCustomError)(404, "discountId");
    if (!payload.storeId)
        throw (0, customError_1.createCustomError)(400, "storeId");
    if (discount.storeId !== payload.storeId) {
        throw (0, customError_1.createCustomError)(403, "storeId");
    }
    let rule = payload.rule;
    let type = payload.type;
    let value = payload.value;
    let minPurchase = payload.minPurchase;
    let maxDiscount = payload.maxDiscount;
    if (rule === "BOGO") {
        type = "NOMINAL";
        value = 0;
        minPurchase = undefined;
        maxDiscount = undefined;
    }
    else {
        if (!value || value <= 0)
            throw (0, customError_1.createCustomError)(400, "value");
        if (type === "PERCENT" && value > 100) {
            throw (0, customError_1.createCustomError)(400, "value");
        }
    }
    if (rule === "MIN_PURCHASE") {
        if (!minPurchase || minPurchase <= 0) {
            throw (0, customError_1.createCustomError)(400, "minPurchase");
        }
        if (!maxDiscount || maxDiscount <= 0) {
            throw (0, customError_1.createCustomError)(400, "maxDiscount");
        }
    }
    else {
        minPurchase = undefined;
        maxDiscount = undefined;
    }
    const product = await prisma_1.prisma.product.findUnique({
        where: { id: payload.productId },
        select: { id: true },
    });
    if (!product)
        throw (0, customError_1.createCustomError)(404, "productId");
    const stock = await prisma_1.prisma.productStock.findUnique({
        where: {
            productId_storeId: {
                productId: payload.productId,
                storeId: payload.storeId,
            },
        },
        select: { id: true },
    });
    if (!stock)
        throw (0, customError_1.createCustomError)(400, "productId");
    await prisma_1.prisma.discount.update({
        where: { id: discountId },
        data: {
            productId: payload.productId,
            rule,
            type,
            value,
            minPurchase,
            maxDiscount,
        },
    });
}
async function deleteAdminDiscount(discountId, storeId) {
    const discount = await prisma_1.prisma.discount.findUnique({
        where: { id: discountId },
    });
    if (!discount)
        throw (0, customError_1.createCustomError)(404, "discountId");
    if (storeId && discount.storeId !== storeId) {
        throw (0, customError_1.createCustomError)(403, "storeId");
    }
    await prisma_1.prisma.discount.delete({ where: { id: discountId } });
}
