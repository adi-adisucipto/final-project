import { Request, Response, NextFunction } from "express";
import { createStoreService, deleteStoreService, getStoreService, updateStoreService } from "../services/store.service";

export async function createStoreController(req:Request, res:Response, next:NextFunction) {
    try {
        const { name, isActive, address, latitude, longitude, cityId, provinceId, postalCode } = req.body
        const data = await createStoreService(
            name,
            isActive,
            address,
            latitude,
            longitude,
            cityId,
            provinceId,
            postalCode
        );

        res.status(200).json({
            data
        })
    } catch (error) {
        next(error);
    }
}

export async function getStoreController(req:Request, res:Response, next:NextFunction) {
    try {
        const data = await getStoreService();
        
        res.status(200).json({
            data
        })
    } catch (error) {
        next(error);
    }
}

export async function deleteStoreController(req:Request, res:Response, next:NextFunction) {
    try {
        const { storeId } = req.body;
        await deleteStoreService(storeId);

        res.json({
            message: "Berhasil menghapus toko"
        })
    } catch (error) {
        next(error);
    }
}

export async function updateStoreController(req:Request, res:Response, next:NextFunction) {
    try {
        const {
            storeId,
            name,
            isActive,
            address,
            latitude,
            longitude,
            cityId,
            provinceId,
            postalCode
        } = req.body;

        const data = await updateStoreService(
            storeId,
            name,
            isActive,
            address,
            latitude,
            longitude,
            cityId,
            provinceId,
            postalCode
        );

        res.status(200).json({
            data
        })
    } catch (error) {
        next(error);
    }
}