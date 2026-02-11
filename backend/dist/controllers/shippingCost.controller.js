"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shippingCostCalculatingController = shippingCostCalculatingController;
const shippingCost_service_1 = require("../services/shippingCost.service");
async function shippingCostCalculatingController(req, res, next) {
    try {
        const { storeCityId, userCityId, weightInGrams, courierCode } = req.body;
        if (!storeCityId || !userCityId || !weightInGrams || !courierCode) {
            return res.status(400).json({
                message: "Parameter ongkir tidak lengkap",
            });
        }
        const result = await (0, shippingCost_service_1.shippingCostCalculatingService)(storeCityId, userCityId, weightInGrams, courierCode);
        res.status(200).json({
            result: result.data.data
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Gagal menghitung ongkir",
        });
    }
}
