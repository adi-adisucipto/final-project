import { Request, Response, NextFunction } from "express";
import { syncRajaOngkirCitiesService, syncRajaOngkirProvincesService } from "../services/address.service";

export async function syncRajaOngkirProvincesController(req: Request, res: Response, next: NextFunction) {
    try {
        const result = syncRajaOngkirProvincesService();

        res.json({
            result
        })
    } catch (error) {
        next(error)
    }
}

export async function syncRajaOngkirCitiesController(req: Request, res: Response, next: NextFunction) {
    try {
        const result = syncRajaOngkirCitiesService();

        res.json({
            result
        })
    } catch (error) {
        next(error)
    }
}