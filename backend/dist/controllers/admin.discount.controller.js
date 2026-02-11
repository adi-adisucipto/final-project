"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAdminDiscountsController = listAdminDiscountsController;
exports.listDiscountProductsController = listDiscountProductsController;
exports.createAdminDiscountController = createAdminDiscountController;
exports.updateAdminDiscountController = updateAdminDiscountController;
exports.deleteAdminDiscountController = deleteAdminDiscountController;
const prisma_1 = require("../lib/prisma");
const customError_1 = require("../utils/customError");
const admin_discount_service_1 = require("../services/admin.discount.service");
const admin_discount_list_1 = require("../services/admin.discount.list");
const parseString = (value) => typeof value === "string" ? value.trim() : "";
const parseNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};
const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const getStoreIdForAdmin = async (userId) => {
    const storeAdmin = await prisma_1.prisma.storeAdmin.findUnique({
        where: { userId },
        select: { storeId: true },
    });
    if (!storeAdmin) {
        throw (0, customError_1.createCustomError)(403, "storeId");
    }
    return storeAdmin.storeId;
};
async function listAdminDiscountsController(req, res, next) {
    try {
        const pageRaw = parseNumber(req.query.page);
        let page = 1;
        if (pageRaw !== undefined && pageRaw > 0)
            page = Math.floor(pageRaw);
        const limitRaw = parseNumber(req.query.limit);
        let limit = 10;
        if (limitRaw !== undefined && limitRaw > 0)
            limit = Math.floor(limitRaw);
        if (limit > 50)
            limit = 50;
        const search = parseString(req.query.search) || undefined;
        let storeId = parseString(req.query.storeId) || undefined;
        if (storeId && !isUuid(storeId))
            throw (0, customError_1.createCustomError)(400, "storeId");
        if (req.user?.role === "admin") {
            storeId = await getStoreIdForAdmin(req.user.id);
        }
        const data = await (0, admin_discount_list_1.listAdminDiscounts)({ page, limit, search, storeId });
        res.status(200).json({ data });
    }
    catch (error) {
        next(error);
    }
}
async function listDiscountProductsController(req, res, next) {
    try {
        let storeId = parseString(req.query.storeId);
        if (req.user?.role === "admin") {
            storeId = await getStoreIdForAdmin(req.user.id);
        }
        if (!storeId || !isUuid(storeId))
            throw (0, customError_1.createCustomError)(400, "storeId");
        const data = await (0, admin_discount_list_1.listDiscountProducts)(storeId);
        res.status(200).json({ data });
    }
    catch (error) {
        next(error);
    }
}
async function createAdminDiscountController(req, res, next) {
    try {
        let storeId = parseString(req.body.storeId);
        if (req.user?.role === "admin") {
            storeId = await getStoreIdForAdmin(req.user.id);
        }
        if (!storeId || !isUuid(storeId))
            throw (0, customError_1.createCustomError)(400, "storeId");
        const productId = parseString(req.body.productId);
        if (!productId)
            throw (0, customError_1.createCustomError)(400, "productId");
        const rule = parseString(req.body.rule);
        if (!["MANUAL", "MIN_PURCHASE", "BOGO"].includes(rule)) {
            throw (0, customError_1.createCustomError)(400, "rule");
        }
        const type = parseString(req.body.type);
        if (!["PERCENT", "NOMINAL"].includes(type)) {
            throw (0, customError_1.createCustomError)(400, "type");
        }
        const value = parseNumber(req.body.value) || 0;
        const minPurchase = parseNumber(req.body.minPurchase);
        const maxDiscount = parseNumber(req.body.maxDiscount);
        const id = await (0, admin_discount_service_1.createAdminDiscount)({
            storeId,
            productId,
            rule: rule,
            type: type,
            value,
            minPurchase,
            maxDiscount,
        });
        res.status(201).json({ data: { id } });
    }
    catch (error) {
        next(error);
    }
}
async function updateAdminDiscountController(req, res, next) {
    try {
        const discountId = parseString(req.params.discountId);
        if (!discountId || !isUuid(discountId)) {
            throw (0, customError_1.createCustomError)(400, "discountId");
        }
        let storeId = parseString(req.body.storeId);
        if (req.user?.role === "admin") {
            storeId = await getStoreIdForAdmin(req.user.id);
        }
        if (!storeId || !isUuid(storeId))
            throw (0, customError_1.createCustomError)(400, "storeId");
        const productId = parseString(req.body.productId);
        if (!productId)
            throw (0, customError_1.createCustomError)(400, "productId");
        const rule = parseString(req.body.rule);
        if (!["MANUAL", "MIN_PURCHASE", "BOGO"].includes(rule)) {
            throw (0, customError_1.createCustomError)(400, "rule");
        }
        const type = parseString(req.body.type);
        if (!["PERCENT", "NOMINAL"].includes(type)) {
            throw (0, customError_1.createCustomError)(400, "type");
        }
        const value = parseNumber(req.body.value) || 0;
        const minPurchase = parseNumber(req.body.minPurchase);
        const maxDiscount = parseNumber(req.body.maxDiscount);
        await (0, admin_discount_service_1.updateAdminDiscount)(discountId, {
            storeId,
            productId,
            rule: rule,
            type: type,
            value,
            minPurchase,
            maxDiscount,
        });
        res.status(200).json({ data: { id: discountId } });
    }
    catch (error) {
        next(error);
    }
}
async function deleteAdminDiscountController(req, res, next) {
    try {
        const discountId = parseString(req.params.discountId);
        if (!discountId || !isUuid(discountId)) {
            throw (0, customError_1.createCustomError)(400, "discountId");
        }
        let storeId;
        if (req.user?.role === "admin") {
            storeId = await getStoreIdForAdmin(req.user.id);
        }
        await (0, admin_discount_service_1.deleteAdminDiscount)(discountId, storeId);
        res.status(200).json({ message: "Discount deleted" });
    }
    catch (error) {
        next(error);
    }
}
