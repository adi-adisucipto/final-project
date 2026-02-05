"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shippingCostCalculatingService = shippingCostCalculatingService;
const axios_1 = __importDefault(require("axios"));
const env_config_1 = require("../configs/env.config");
async function shippingCostCalculatingService(storeCityId, userCityId, weightInGrams, courierCode) {
    try {
        const RAJAONGKIR_KEY = env_config_1.RAJAONGKIR_SHIPPING_COST_KEY;
        const RAJAONGKIR_BASE_URL = 'https://rajaongkir.komerce.id/api/v1';
        const response = await axios_1.default.post(`${RAJAONGKIR_BASE_URL}/calculate/domestic-cost`, {
            origin: storeCityId,
            destination: userCityId,
            weight: weightInGrams,
            courier: courierCode,
        }, {
            headers: {
                key: RAJAONGKIR_KEY,
                'content-type': 'application/x-www-form-urlencoded',
            },
        });
        return response;
    }
    catch (error) {
        console.error("Gagal menghitung ongkir:", error);
        throw error;
    }
}
