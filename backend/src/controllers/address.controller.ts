import { Request, Response, NextFunction } from "express";
import { deleteAddressService, getAddressByIdService, getAddressService, getCitesServices, getProvincesServices, syncRajaOngkirCitiesService, syncRajaOngkirProvincesService, updateAddressService, userAddressService } from "../services/address.service";

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

export async function getAddressController(req:Request, res:Response, next:NextFunction) {
    try {
        const { userId } = req.body;
        const data = await getAddressService(userId);

        res.status(200).json({
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

export async function deleteAddressController(req:Request, res:Response, next:NextFunction) {
    try {
        const { addressId } = req.body;
        const { message } = await deleteAddressService(addressId);

        res.status(200).json({
            message: message
        })
    } catch (error) {
        
    }
}

export async function getAddressByIdController(req:Request, res:Response, next:NextFunction) {
    try {
        const { addressId } = req.body;
        const data = await getAddressByIdService(addressId);

        res.json({
            data
        });
    } catch (error) {
        next(error);
    }
}

export async function updateAddressController(req:Request, res:Response, next:NextFunction) {
    try {
        const { addressId, firstName, lastName, provinceId, cityId, address, mainAddress } = req.body;

        const data = await updateAddressService(addressId, firstName, lastName, provinceId, cityId, address, mainAddress);

        res.status(200).json({
            data
        })
    } catch (error) {
        next(error);
    }
}