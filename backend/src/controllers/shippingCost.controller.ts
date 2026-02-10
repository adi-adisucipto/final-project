import { Request, Response, NextFunction } from "express";
import { shippingCostCalculatingService } from "../services/shippingCost.service";

export async function shippingCostCalculatingController(req:Request, res:Response, next:NextFunction) {
    try {
        const { storeCityId, userCityId, weightInGrams, courierCode } = req.body;
        if (!storeCityId || !userCityId || !weightInGrams || !courierCode) {
            return res.status(400).json({
                message: "Parameter ongkir tidak lengkap",
            });
        }
        const result = await shippingCostCalculatingService(storeCityId, userCityId, weightInGrams, courierCode);

        res.status(200).json({
            result: result.data.data
        })
    } catch (error) {
        res.status(500).json({
            message: "Gagal menghitung ongkir",
        });
    }
}