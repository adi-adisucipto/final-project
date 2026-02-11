"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listInventoryController = listInventoryController;
exports.listInventoryProductsController = listInventoryProductsController;
exports.adjustInventoryController = adjustInventoryController;
exports.deleteInventoryController = deleteInventoryController;
const customError_1 = require("../utils/customError");
const admin_inventory_service_1 = require("../services/admin.inventory.service");
const parseString = (value) => typeof value === "string" ? value.trim() : "";
const parseNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};
const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
async function listInventoryController(req, res, next) {
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
        const storeId = parseString(req.query.storeId) || undefined;
        if (storeId && !isUuid(storeId))
            throw (0, customError_1.createCustomError)(400, "storeId");
        const data = await (0, admin_inventory_service_1.listInventory)({ page, limit, search, storeId });
        res.status(200).json({ data });
    }
    catch (error) {
        next(error);
    }
}
async function listInventoryProductsController(req, res, next) {
    try {
        const search = parseString(req.query.search) || undefined;
        const data = await (0, admin_inventory_service_1.listInventoryProducts)(search);
        res.status(200).json({ data });
    }
    catch (error) {
        next(error);
    }
}
async function adjustInventoryController(req, res, next) {
    try {
        const storeId = parseString(req.body.storeId);
        if (!storeId || !isUuid(storeId))
            throw (0, customError_1.createCustomError)(400, "storeId");
        const productId = parseString(req.body.productId);
        if (!productId || !isUuid(productId)) {
            throw (0, customError_1.createCustomError)(400, "productId");
        }
        const action = parseString(req.body.action);
        if (action !== "IN" && action !== "OUT") {
            throw (0, customError_1.createCustomError)(400, "action");
        }
        const quantity = parseNumber(req.body.quantity);
        if (quantity === undefined || quantity <= 0) {
            throw (0, customError_1.createCustomError)(400, "quantity");
        }
        const note = parseString(req.body.note) || undefined;
        const data = await (0, admin_inventory_service_1.adjustInventory)({
            storeId,
            productId,
            action,
            quantity,
            note,
        });
        res.status(200).json({ data });
    }
    catch (error) {
        next(error);
    }
}
async function deleteInventoryController(req, res, next) {
    try {
        const stockId = parseString(req.params.stockId);
        if (!stockId || !isUuid(stockId)) {
            throw (0, customError_1.createCustomError)(400, "stockId");
        }
        await (0, admin_inventory_service_1.deleteInventory)(stockId);
        res.status(200).json({ message: "Stock deleted" });
    }
    catch (error) {
        next(error);
    }
}
