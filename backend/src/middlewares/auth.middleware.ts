import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { createCustomError } from "../utils/customError";
import { SECRET_KEY_ACCESS } from "../configs/env.config";

export interface Token {
    id: string,
    email: string,
    is_verified: boolean,
    role: string,
    referral_code: string,
    first_name: string,
    last_name: string,
    avatar: string
}

declare module "express-serve-static-core" {
    interface Request {
        user?: Token;
    }
}

export function authMiddleware(req:Request, res:Response, next:NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            throw createCustomError(401, "Unauthorized!");
        }

        const token = authHeader.split(" ")[1];
        console.log(token)
        const decode = verify(token, SECRET_KEY_ACCESS) as Token;

        req.user = decode as Token;

        next()
    } catch (error) {
        next(error);
    }
}