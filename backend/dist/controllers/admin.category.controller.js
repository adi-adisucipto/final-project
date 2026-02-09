"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAdminCategoriesController = listAdminCategoriesController;
exports.createAdminCategoryController = createAdminCategoryController;
exports.updateAdminCategoryController = updateAdminCategoryController;
exports.deleteAdminCategoryController = deleteAdminCategoryController;
const customError_1 = require("../utils/customError");
const admin_category_service_1 = require("../services/admin.category.service");
const parseString = (value) => typeof value === "string" ? value.trim() : "";
const parseNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};
const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
async function listAdminCategoriesController(req, res, next) {
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
        const data = await (0, admin_category_service_1.listAdminCategories)({ page, limit, search });
        res.status(200).json({ data });
    }
    catch (error) {
        next(error);
    }
}
async function createAdminCategoryController(req, res, next) {
    try {
        const name = parseString(req.body.name);
        if (!name)
            throw (0, customError_1.createCustomError)(400, "name");
        const data = await (0, admin_category_service_1.createAdminCategory)(name);
        res.status(201).json({ data });
    }
    catch (error) {
        next(error);
    }
}
async function updateAdminCategoryController(req, res, next) {
    try {
        const categoryId = parseString(req.params.categoryId);
        if (!categoryId || !isUuid(categoryId)) {
            throw (0, customError_1.createCustomError)(400, "categoryId");
        }
        const name = parseString(req.body.name);
        if (!name)
            throw (0, customError_1.createCustomError)(400, "name");
        const data = await (0, admin_category_service_1.updateAdminCategory)(categoryId, name);
        res.status(200).json({ data });
    }
    catch (error) {
        next(error);
    }
}
async function deleteAdminCategoryController(req, res, next) {
    try {
        const categoryId = parseString(req.params.categoryId);
        if (!categoryId || !isUuid(categoryId)) {
            throw (0, customError_1.createCustomError)(400, "categoryId");
        }
        await (0, admin_category_service_1.deleteAdminCategory)(categoryId);
        res.status(200).json({ message: "Category deleted" });
    }
    catch (error) {
        next(error);
    }
}
