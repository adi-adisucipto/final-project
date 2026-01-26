import axios from "axios";
import { RAJAONGKIR_SHIPPING_COST_KEY } from "../configs/env.config";

export async function shippingCostCalculatingService(
    storeCityId: number,
    userCityId: number,
    weightInGrams: number,
    courierCode: string
) {
    try {
        const RAJAONGKIR_KEY = RAJAONGKIR_SHIPPING_COST_KEY;
        const RAJAONGKIR_BASE_URL = 'https://rajaongkir.komerce.id/api/v1';

        const response = await axios.post(
            `${RAJAONGKIR_BASE_URL}/calculate/domestic-cost`,
            {
                origin: storeCityId,
                destination: userCityId,
                weight: weightInGrams,
                courier: courierCode,
            },
            {
                headers: {
                    key: RAJAONGKIR_KEY,
                    'content-type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Gagal menghitung ongkir:", error);
        throw error;
    }
}