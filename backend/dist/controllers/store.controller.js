"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoreController = createStoreController;
exports.getStoreController = getStoreController;
exports.deleteStoreController = deleteStoreController;
exports.updateStoreController = updateStoreController;
exports.getAdminsController = getAdminsController;
exports.assignAdminController = assignAdminController;
exports.activateStoreController = activateStoreController;
const store_service_1 = require("../services/store.service");
async function createStoreController(req, res, next) {
    try {
        const { name, isActive, address, latitude, longitude, cityId, provinceId, postalCode } = req.body;
        const data = await (0, store_service_1.createStoreService)(name, isActive, address, latitude, longitude, cityId, provinceId, postalCode);
        res.status(200).json({
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function getStoreController(req, res, next) {
    try {
        const data = await (0, store_service_1.getStoreService)();
        res.status(200).json({
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function deleteStoreController(req, res, next) {
    try {
        const { storeId } = req.body;
        await (0, store_service_1.deleteStoreService)(storeId);
        res.json({
            message: "Berhasil menghapus toko"
        });
    }
    catch (error) {
        next(error);
    }
}
async function updateStoreController(req, res, next) {
    try {
        const { storeId, name, isActive, address, latitude, longitude, cityId, provinceId, postalCode } = req.body;
        const data = await (0, store_service_1.updateStoreService)(storeId, name, isActive, address, latitude, longitude, cityId, provinceId, postalCode);
        res.status(200).json({
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function getAdminsController(req, res, next) {
    try {
        const data = await (0, store_service_1.getAdminsService)();
        res.status(200).json({
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function assignAdminController(req, res, next) {
    try {
        const { userId, storeId } = req.body;
        const data = await (0, store_service_1.assignAdminService)(userId, storeId);
        res.status(200).json({
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function activateStoreController(req, res, next) {
    try {
        const { storeId } = req.body;
        await (0, store_service_1.activateStoreService)(storeId);
        res.status(200).json({
            message: "Berhasil mengaktifkan toko"
        });
    }
    catch (error) {
        next(error);
    }
}
