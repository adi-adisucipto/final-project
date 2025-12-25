import { Request, Response, NextFunction } from "express";
import { createRegisTokenService } from "../services/auth.service";

export async function createRegisTokenController(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;
        
        await createRegisTokenService(email);

        res.status(200).json({
            message: "Email Registration has been sent. Please check your inbox!"
        })
    } catch (error) {
        next(error);
    }
}