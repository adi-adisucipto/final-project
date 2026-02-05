"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAdminProductsController = listAdminProductsController;
exports.createAdminProductController = createAdminProductController;
exports.updateAdminProductController = updateAdminProductController;
exports.deleteAdminProductController = deleteAdminProductController;
const customError_1 = require("../utils/customError");
const admin_product_service_1 = require("../services/admin.product.service");
const parseString = (value) => typeof value === "string" ? value.trim() : "";
const parseNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};
const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const parseSort = (value) => {
    if (value === "price_asc" || value === "price_desc")
        return value;
    return "newest";
};
async function listAdminProductsController(req, res, next) {
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
        const categoryId = parseString(req.query.categoryId) || undefined;
        const storeIdText = parseString(req.query.storeId);
        let storeId;
        if (storeIdText) {
            if (!isUuid(storeIdText))
                throw (0, customError_1.createCustomError)(400, "storeId");
            storeId = storeIdText;
        }
        const minPrice = parseNumber(req.query.minPrice);
        if (minPrice !== undefined && minPrice < 0) {
            throw (0, customError_1.createCustomError)(400, "minPrice");
        }
        const maxPrice = parseNumber(req.query.maxPrice);
        if (maxPrice !== undefined && maxPrice < 0) {
            throw (0, customError_1.createCustomError)(400, "maxPrice");
        }
        if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
            throw (0, customError_1.createCustomError)(400, "minPrice > maxPrice");
        }
        const sort = parseSort(req.query.sort);
        const params = {
            page,
            limit,
            search,
            categoryId,
            storeId,
            minPrice,
            maxPrice,
            sort,
        };
        const data = await (0, admin_product_service_1.listAdminProducts)(params);
        res.status(200).json({ data });
    }
    catch (error) {
        next(error);
    }
}
async function createAdminProductController(req, res, next) {
    try {
        const name = parseString(req.body.name);
        if (!name)
            throw (0, customError_1.createCustomError)(400, "name");
        const description = parseString(req.body.description);
        if (!description)
            throw (0, customError_1.createCustomError)(400, "description");
        const price = parseNumber(req.body.price);
        if (price === undefined || price <= 0)
            throw (0, customError_1.createCustomError)(400, "price");
        const stock = parseNumber(req.body.stock);
        if (stock === undefined || stock < 0)
            throw (0, customError_1.createCustomError)(400, "stock");
        const categoryId = parseString(req.body.categoryId);
        if (!categoryId)
            throw (0, customError_1.createCustomError)(400, "categoryId");
        const storeId = parseString(req.body.storeId);
        if (!storeId)
            throw (0, customError_1.createCustomError)(400, "storeId");
        if (!isUuid(storeId))
            throw (0, customError_1.createCustomError)(400, "storeId");
        let isActive = true;
        if (req.body.isActive === false || req.body.isActive === "false") {
            isActive = false;
        }
        const data = await (0, admin_product_service_1.createAdminProduct)({
            name,
            description,
            price,
            stock,
            categoryId,
            storeId,
            isActive,
        });
        res.status(201).json({ data });
    }
    catch (error) {
        next(error);
    }
}
async function updateAdminProductController(req, res, next) {
    try {
        const productId = parseString(req.params.productId);
        if (!productId || !isUuid(productId)) {
            throw (0, customError_1.createCustomError)(400, "productId");
        }
        const name = parseString(req.body.name);
        if (!name)
            throw (0, customError_1.createCustomError)(400, "name");
        const description = parseString(req.body.description);
        if (!description)
            throw (0, customError_1.createCustomError)(400, "description");
        const price = parseNumber(req.body.price);
        if (price === undefined || price <= 0)
            throw (0, customError_1.createCustomError)(400, "price");
        const stock = parseNumber(req.body.stock);
        if (stock === undefined || stock < 0)
            throw (0, customError_1.createCustomError)(400, "stock");
        const categoryId = parseString(req.body.categoryId);
        if (!categoryId)
            throw (0, customError_1.createCustomError)(400, "categoryId");
        const storeId = parseString(req.body.storeId);
        if (!storeId)
            throw (0, customError_1.createCustomError)(400, "storeId");
        if (!isUuid(storeId))
            throw (0, customError_1.createCustomError)(400, "storeId");
        const previousStoreIdText = parseString(req.body.previousStoreId);
        let previousStoreId;
        if (previousStoreIdText) {
            if (!isUuid(previousStoreIdText)) {
                throw (0, customError_1.createCustomError)(400, "previousStoreId");
            }
            previousStoreId = previousStoreIdText;
        }
        let isActive;
        if (req.body.isActive === true || req.body.isActive === "true") {
            isActive = true;
        }
        else if (req.body.isActive === false || req.body.isActive === "false") {
            isActive = false;
        }
        const data = await (0, admin_product_service_1.updateAdminProduct)({
            id: productId,
            name,
            description,
            price,
            stock,
            categoryId,
            storeId,
            isActive,
            previousStoreId,
        });
        res.status(200).json({ data });
    }
    catch (error) {
        next(error);
    }
}
async function deleteAdminProductController(req, res, next) {
    try {
        const productId = parseString(req.params.productId);
        if (!productId || !isUuid(productId)) {
            throw (0, customError_1.createCustomError)(400, "productId");
        }
        await (0, admin_product_service_1.deleteAdminProduct)(productId);
        res.status(200).json({ message: "Product deleted" });
    }
    catch (error) {
        next(error);
    }
}
