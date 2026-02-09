"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const uploader_1 = __importDefault(require("../utils/uploader"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const profileRouter = (0, express_1.Router)();
// profileRouter.use(authMiddleware);
profileRouter.post("/update-profile", auth_middleware_1.authMiddleware, (0, uploader_1.default)().single("avatar"), profile_controller_1.updateUserController);
profileRouter.post("/change-password", profile_controller_1.sendEmailChangePasswordController);
profileRouter.post("/password-change", profile_controller_1.changePasswordController);
exports.default = profileRouter;
