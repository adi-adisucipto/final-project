"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestChangeEmailController = requestChangeEmailController;
exports.changeEmailController = changeEmailController;
const changeEmail_service_1 = require("../services/changeEmail.service");
const jsonwebtoken_1 = require("jsonwebtoken");
const env_config_1 = require("../configs/env.config");
async function requestChangeEmailController(req, res, next) {
    try {
        const currentEmail = req.user?.email;
        if (!currentEmail)
            throw new Error("Unauthorized");
        const { newEmail, password } = req.body;
        await (0, changeEmail_service_1.requestChangeEmailService)(currentEmail, newEmail, password);
        res.status(200).json({
            message: "Verification link sent to your new email. Please check your inbox!"
        });
    }
    catch (error) {
        next(error);
    }
}
async function changeEmailController(req, res, next) {
    try {
        const { token } = req.body;
        if (!token || typeof token !== 'string')
            return res.status(400).json({ message: "Token is missing or invalid" });
        const decoded = (0, jsonwebtoken_1.verify)(token, env_config_1.SECRET_KEY_REGIS);
        const updatedUser = await (0, changeEmail_service_1.changeEmailService)(decoded.email, decoded.id, token);
        res.status(200).json({
            message: "Email successfully changed",
            data: {
                id: updatedUser.id,
                email: updatedUser.email
            }
        });
    }
    catch (error) {
        next(error);
    }
}
