"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProductsController = listProductsController;
exports.listProductCategoriesController = listProductCategoriesController;
exports.getProductDetailController = getProductDetailController;
const customError_1 = require("../utils/customError");
const product_service_1 = require("../services/product.service");
const parseNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};
const parseString = (value) => typeof value === "string" ? value.trim() : "";
const parseSort = (value) => {
    if (value === "price_asc" || value === "price_desc")
        return value;
    return "newest";
};
const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
async function listProductsController(req, res, next) {
    try {
        const pageRaw = parseNumber(req.query.page);
        let page = 1;
        if (pageRaw !== undefined && pageRaw > 0)
            page = Math.floor(pageRaw);
        const limitRaw = parseNumber(req.query.limit);
        let limit = 9;
        if (limitRaw !== undefined && limitRaw > 0)
            limit = Math.floor(limitRaw);
        if (limit > 30)
            limit = 30;
        const search = parseString(req.query.search);
        if (search.length > 80)
            throw (0, customError_1.createCustomError)(400, "search too long");
        const categoryId = parseString(req.query.categoryId) || undefined;
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
        const lat = parseNumber(req.query.lat);
        if (lat !== undefined && (lat < -90 || lat > 90)) {
            throw (0, customError_1.createCustomError)(400, "lat");
        }
        const lng = parseNumber(req.query.lng);
        if (lng !== undefined && (lng < -180 || lng > 180)) {
            throw (0, customError_1.createCustomError)(400, "lng");
        }
        const params = {
            page,
            limit,
            search,
            categoryId,
            minPrice,
            maxPrice,
            lat,
            lng,
            sort: parseSort(req.query.sort),
        };
        const data = await (0, product_service_1.getProductCatalog)(params);
        res.status(200).json({ data });
    }
    catch (error) {
        next(error);
    }
}
async function listProductCategoriesController(req, res, next) {
    try {
        const data = await (0, product_service_1.getProductCategories)();
        res.status(200).json({ data });
    }
    catch (error) {
        next(error);
    }
}
async function getProductDetailController(req, res, next) {
    try {
        const productId = parseString(req.params.id);
        if (!productId || !isUuid(productId)) {
            throw (0, customError_1.createCustomError)(400, "productId");
        }
        const storeIdRaw = parseString(req.query.storeId);
        let storeId;
        if (storeIdRaw) {
            if (!isUuid(storeIdRaw))
                throw (0, customError_1.createCustomError)(400, "storeId");
            storeId = storeIdRaw;
        }
        const lat = parseNumber(req.query.lat);
        if (lat !== undefined && (lat < -90 || lat > 90)) {
            throw (0, customError_1.createCustomError)(400, "lat");
        }
        const lng = parseNumber(req.query.lng);
        if (lng !== undefined && (lng < -180 || lng > 180)) {
            throw (0, customError_1.createCustomError)(400, "lng");
        }
        const params = { productId, storeId, lat, lng };
        const data = await (0, product_service_1.getProductDetail)(params);
        res.status(200).json({ data });
    }
    catch (error) {
        next(error);
    }
}
