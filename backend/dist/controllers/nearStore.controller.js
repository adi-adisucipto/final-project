"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearStoreController = nearStoreController;
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
