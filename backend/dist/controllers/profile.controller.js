"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserController = updateUserController;
exports.sendEmailChangePasswordController = sendEmailChangePasswordController;
exports.changePasswordController = changePasswordController;
const profile_service_1 = require("../services/profile.service");
async function updateUserController(req, res, next) {
    try {
        const { email, first_name, last_name } = req.body;
        const file = req.file;
        const data = await (0, profile_service_1.updateUser)(email, first_name, last_name, file);
        res.status(200).json({
            message: "Update success",
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function sendEmailChangePasswordController(req, res, next) {
    try {
        const { email } = req.body;
        await (0, profile_service_1.sendEmailChangePasswordService)(email);
        res.status(200).json({
            message: "Email has been sent. Please check your inbox!"
        });
    }
    catch (error) {
        next(error);
    }
}
async function changePasswordController(req, res, next) {
    try {
        const { token, password, confirmPassword } = req.body;
        await (0, profile_service_1.changePasswordService)(token, password, confirmPassword);
        res.status(200).json({
            message: "Security update successful"
        });
    }
    catch (error) {
        next(error);
    }
}
