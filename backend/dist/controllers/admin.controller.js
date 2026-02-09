"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersController = listUsersController;
exports.updateUserRoleController = updateUserRoleController;
exports.deleteUserController = deleteUserController;
const admin_service_1 = require("../services/admin.service");
const customError_1 = require("../utils/customError");
async function listUsersController(req, res, next) {
    try {
        const data = await (0, admin_service_1.listUsersService)();
        res.status(200).json({
            data,
        });
    }
    catch (error) {
        next(error);
    }
}
async function updateUserRoleController(req, res, next) {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        if (req.user?.id === userId) {
            throw (0, customError_1.createCustomError)(400, "Cannot update your own role");
        }
        const data = await (0, admin_service_1.updateUserRoleService)(userId, role);
        res.status(200).json({
            message: "Role updated",
            data,
        });
    }
    catch (error) {
        next(error);
    }
}
async function deleteUserController(req, res, next) {
    try {
        const { userId } = req.params;
        if (req.user?.id === userId) {
            throw (0, customError_1.createCustomError)(400, "Cannot delete your own account");
        }
        await (0, admin_service_1.deleteUserService)(userId);
        res.status(200).json({
            message: "User deleted",
        });
    }
    catch (error) {
        next(error);
    }
}
