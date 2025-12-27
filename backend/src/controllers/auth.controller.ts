import { Request, Response, NextFunction } from "express";
import { createRegisTokenService, createUserService, googleLoginService, loginService, refreshTokensService } from "../services/auth.service";
import { verify } from "jsonwebtoken";
import { SECRET_KEY_REGIS } from "../configs/env.config";
import { createCustomError } from "../utils/customError";
import { TokenPayload } from "google-auth-library";

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

export async function loginController(req:Request, res:Response, next:NextFunction) {
    try {
        const { email, password } = req.body;
        const tokens = await loginService(email, password);
        const { accessToken, refreshToken } = tokens

        res.status(200).json({
            accessToken,
            refreshToken
        })
    } catch (error) {
        next(error);
    }
}

export async function refreshTokenController(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.body.refreshToken;
        const data = await refreshTokensService(refreshToken);

        res.status(200).json({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
        })
    } catch (error) {
        next(error);
    }
}

interface CustomRequest extends Request {
  user?: TokenPayload;
}

export async function googleLoginController(req:CustomRequest, res:Response, next:NextFunction) {
    try {
        const payload = req.user;
        const email = payload?.email!;

        const tokens = await googleLoginService(email);
        const { accessToken, refreshToken } = tokens;

        res.status(200).json({
            accessToken,
            refreshToken
        })
    } catch (error) {
        next(error);
    }
}