import { Request, Response, NextFunction } from "express";
import { createRegisTokenService, createUserService } from "../services/auth.service";
import { verify } from "jsonwebtoken";
import { SECRET_KEY_REGIS } from "../configs/env.config";
import { createCustomError } from "../utils/customError";

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

export async function createUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const {password, firstName, lastName, refCode} = req.body;

        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            throw createCustomError(401, "Unauthorize");
        }
        const token = authHeader.split(" ")[1];
        const decoded = verify(token, SECRET_KEY_REGIS) as { email: string }
        if (!decoded || !decoded.email) { 
            throw createCustomError(401, "Invalid Token Payload"); 
        }
        const email = decoded.email;

        if(!decoded) { createCustomError(404, "not found") }

        await createUserService(email, password, firstName, lastName, refCode, token);

        res.status(200).json({
            message: "User has created successfully! Please Login!"
        });
    } catch (error) {
        next(error);
    }
}