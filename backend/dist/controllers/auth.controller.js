"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegisTokenController = createRegisTokenController;
exports.createUserController = createUserController;
exports.loginController = loginController;
exports.refreshTokenController = refreshTokenController;
exports.googleLoginController = googleLoginController;
const auth_service_1 = require("../services/auth.service");
const jsonwebtoken_1 = require("jsonwebtoken");
const env_config_1 = require("../configs/env.config");
const customError_1 = require("../utils/customError");
const auth_validation_1 = require("../validations/auth.validation");
async function createRegisTokenController(req, res, next) {
    try {
        const { email } = auth_validation_1.registerSchema.parse(req.body);
        await (0, auth_service_1.createRegisTokenService)(email);
        res.status(200).json({
            message: "Email Registration has been sent. Please check your inbox!"
        });
    }
    catch (error) {
        next(error);
    }
}
async function createUserController(req, res, next) {
    try {
        const { password, firstName, lastName, refCode } = auth_validation_1.createUserSchema.parse(req.body);
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw (0, customError_1.createCustomError)(401, "Unauthorize");
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jsonwebtoken_1.verify)(token, env_config_1.SECRET_KEY_REGIS);
        if (!decoded || !decoded.email) {
            throw (0, customError_1.createCustomError)(401, "Invalid Token Payload");
        }
        const email = decoded.email;
        await (0, auth_service_1.createUserService)(email, password, firstName, lastName, refCode, token);
        res.status(201).json({
            message: "User has created successfully! Please Login!"
        });
    }
    catch (error) {
        next(error);
    }
}
async function loginController(req, res, next) {
    try {
        const { email, password } = auth_validation_1.loginSchema.parse(req.body);
        const tokens = await (0, auth_service_1.loginService)(email, password);
        const { accessToken, refreshToken } = tokens;
        res.status(200).json({
            accessToken,
            refreshToken
        });
    }
    catch (error) {
        next(error);
    }
}
async function refreshTokenController(req, res, next) {
    try {
        const refreshToken = req.body.refreshToken;
        const data = await (0, auth_service_1.refreshTokensService)(refreshToken);
        res.status(200).json({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
        });
    }
    catch (error) {
        next(error);
    }
}
async function googleLoginController(req, res, next) {
    try {
        const payload = req.googleUser;
        const email = payload?.email;
        const tokens = await (0, auth_service_1.googleLoginService)(email);
        const { accessToken, refreshToken } = tokens;
        res.status(200).json({
            accessToken,
            refreshToken
        });
    }
    catch (error) {
        next(error);
    }
}
