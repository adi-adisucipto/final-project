import { Request, Response, NextFunction } from "express";
import { getCitesServices, getProvincesServices, syncRajaOngkirCitiesService, syncRajaOngkirProvincesService, userAddressService } from "../services/address.service";

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

export async function getProvincesController(req:Request, res:Response, next:NextFunction) {
    try {
        const data = await getProvincesServices();

        res.json({
            data
        })
    } catch (error) {
        next(error);
    }
}

export async function getCitiesController(req:Request, res:Response, next:NextFunction) {
    try {
        const { provinceId } = req.body;
        const data = await getCitesServices(provinceId);

        res.json({
            data
        })
    } catch (error) {
        next(error);
    }
}

export async function userAddressController(req:Request, res:Response, next:NextFunction) {
    try {
        const { firstName, lastName, provinceId, cityId, address, mainAddress, userId } = req.body;

        const data = await userAddressService(firstName, lastName, provinceId, cityId, address, mainAddress, userId);

        res.status(200).json({
            data
        })
    } catch (error) {
        next(error);
    }
}