import { Request, Response, NextFunction } from "express";
import { mainStoreService, nearStoreService, productByStoreService } from "../services/nearStore.service";

export async function nearStoreController(req: Request, res: Response, next: NextFunction) {
    try {
        const { userLat, userLng } = req.body;

        const nearStores = await nearStoreService(userLat, userLng);

        res.status(200).json({
            nearStores
        })
    } catch (error) {
        next(error);
    }
}

export async function mainStoreController(req: Request, res: Response, next: NextFunction) {
    try {
        const { storeId } = req.params;
        const store = await mainStoreService(storeId);

        res.status(200).json({
            store
        })
    } catch (error) {
        next(error);
    }
}

export async function productByStoreController(req: Request, res: Response, next: NextFunction) {
    try {
        const { storeId } = req.params;
        const product = await productByStoreService(storeId);

        res.status(200).json({
            product
        })
    } catch (error) {
        next(error)
    }
}