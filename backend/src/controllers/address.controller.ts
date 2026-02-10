import { Request, Response, NextFunction } from "express";
import { createCustomError } from "../utils/customError";
import {
    deleteAddressService,
    getAddressByIdService,
    getAddressService,
    getCitesServices,
    getProvincesServices,
    syncRajaOngkirCitiesService,
    syncRajaOngkirProvincesService,
    updateAddressService,
    createUserAddressService
} from "../services/address.service";
import { createUpdateAddressSchema } from "../validations/address.validation";

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
        const userId = req.user?.id;
        if(!userId) throw createCustomError(401, "Unauthorized")
        const data = await getAddressService(userId);

        res.status(200).json({
            data
        })
    } catch (error) {
        next(error);
    }
}

export async function createUserAddressController(req:Request, res:Response, next:NextFunction) {
    try {
        const { firstName, lastName, provinceId, cityId, address, mainAddress } = createUpdateAddressSchema.parse(req.body);
        const userId = req.user?.id
        if(!userId) throw createCustomError(401, "Unauthorized")

        const data = await createUserAddressService(firstName, lastName, provinceId, cityId, address, mainAddress, userId);

        res.status(201).json({
            data
        })
    } catch (error) {
        next(error);
    }
}

export async function deleteAddressController(req:Request, res:Response, next:NextFunction) {
    try {
        const { addressId } = req.params;
        if (!addressId) throw new Error("Address ID is required");

        const userId = req.user?.id
        if (!userId) throw new Error("Unauthorized");
        const { message } = await deleteAddressService(addressId, userId);

        res.status(200).json({
            message: message
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export async function getAddressByIdController(req:Request, res:Response, next:NextFunction) {
    try {
        const { id } = req.params;
        const data = await getAddressByIdService(id);

        res.json({
            data
        });
    } catch (error) {
        next(error);
    }
}

export async function updateAddressController(req:Request, res:Response, next:NextFunction) {
    try {
        const { addressId } = req.params;
        const { firstName, lastName, provinceId, cityId, address, mainAddress } = createUpdateAddressSchema.parse(req.body);
        const userId = req.user?.id;
        if(!userId) throw createCustomError(401, "Unauthorized")

        const data = await updateAddressService(addressId, firstName, lastName, provinceId, cityId, address, mainAddress, userId);

        res.status(200).json({
            data
        })
    } catch (error) {
        next(error);
    }
}