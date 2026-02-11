"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearStoreController = nearStoreController;
exports.mainStoreController = mainStoreController;
exports.productByStoreController = productByStoreController;
const nearStore_service_1 = require("../services/nearStore.service");
async function nearStoreController(req, res, next) {
    try {
        const { userLat, userLng } = req.body;
        const nearStores = await (0, nearStore_service_1.nearStoreService)(userLat, userLng);
        res.status(200).json({
            nearStores
        });
    }
    catch (error) {
        next(error);
    }
}
async function mainStoreController(req, res, next) {
    try {
        const { storeId } = req.params;
        const store = await (0, nearStore_service_1.mainStoreService)(storeId);
        res.status(200).json({
            store
        });
    }
    catch (error) {
        next(error);
    }
}
async function productByStoreController(req, res, next) {
    try {
        const { storeId } = req.params;
        const product = await (0, nearStore_service_1.productByStoreService)(storeId);
        res.status(200).json({
            product
        });
    }
    catch (error) {
        next(error);
    }
}
