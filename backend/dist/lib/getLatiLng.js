"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoordinates = getCoordinates;
const axios_1 = __importDefault(require("axios"));
const env_config_1 = require("../configs/env.config");
async function getCoordinates(address) {
    try {
        const API_KEY = env_config_1.API_KEY_OPENCAGE;
        const { data } = await axios_1.default.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
                q: address,
                key: API_KEY,
                limit: 1,
                countrycode: 'id'
            },
        });
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const { lat, lng } = result.geometry;
            const formattedAddress = result.formatted;
            const postalCode = result.components.postcode || null;
            return {
                latitude: lat,
                longitude: lng,
                address: formattedAddress,
                postalCode: postalCode
            };
        }
        return null;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Axios Error:', error.message);
        }
        else {
            console.error('Unexpected Error:', error);
        }
        throw error;
    }
}
