"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAdminProductImagesController = uploadAdminProductImagesController;
const customError_1 = require("../utils/customError");
const admin_product_images_service_1 = require("../services/admin.product.images.service");
const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const requireUuid = (value, field) => {
    const text = typeof value === "string" ? value.trim() : "";
    if (!text || !isUuid(text))
        throw (0, customError_1.createCustomError)(400, field);
    return text;
};
const getFiles = (req) => {
    const files = (req.files || []);
    if (!files.length)
        throw (0, customError_1.createCustomError)(400, "images");
    return files;
};
async function uploadAdminProductImagesController(req, res, next) {
    try {
        const productId = requireUuid(req.params.productId, "productId");
        const files = getFiles(req);
        const data = await (0, admin_product_images_service_1.uploadAdminProductImages)(productId, files);
        res.status(201).json({ data });
    }
    catch (error) {
        next(error);
    }
}
