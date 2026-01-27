import { Request, Response, NextFunction } from "express";
import { nearStoreService } from "../services/nearStore.service";

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