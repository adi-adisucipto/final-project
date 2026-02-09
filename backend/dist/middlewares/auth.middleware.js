"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = require("jsonwebtoken");
const customError_1 = require("../utils/customError");
const env_config_1 = require("../configs/env.config");
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw (0, customError_1.createCustomError)(401, "Unauthorized!");
        }
        const token = authHeader.split(" ")[1];
        const decode = (0, jsonwebtoken_1.verify)(token, env_config_1.SECRET_KEY_ACCESS);
        req.user = decode;
        next();
    }
    catch (error) {
        next(error);
    }
}
