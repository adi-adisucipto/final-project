import { Request, Response, NextFunction } from "express";
import { changeEmailService, requestChangeEmailService } from "../services/changeEmail.service";
import { verify } from "jsonwebtoken";
import { SECRET_KEY_REGIS } from "../configs/env.config";

export async function requestChangeEmailController(req: Request, res: Response, next: NextFunction) {
    try {
        const currentEmail = req.user?.email;
        if (!currentEmail) throw new Error("Unauthorized");
        const { newEmail, password } = req.body;
        
        await requestChangeEmailService(currentEmail, newEmail, password);

        res.status(200).json({
            message: "Verification link sent to your new email. Please check your inbox!"
        })
    } catch (error) {
        next(error);
    }
}

export async function changeEmailController(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.body;
        if(!token || typeof token !== 'string') return res.status(400).json({ message: "Token is missing or invalid" });
        const decoded = verify(token, SECRET_KEY_REGIS) as { id: string, email: string }

        const updatedUser = await changeEmailService(decoded.email, decoded.id, token);

        res.status(200).json({
            message: "Email successfully changed",
            data: {
                id: updatedUser.id,
                email: updatedUser.email
            }
        });
    } catch (error) {
        next(error);
    }
}