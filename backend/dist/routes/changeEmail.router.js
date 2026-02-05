"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const changeEmail_controller_1 = require("../controllers/changeEmail.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const changeEmailRouter = (0, express_1.Router)();
changeEmailRouter.post("/request-change-email", auth_middleware_1.authMiddleware, changeEmail_controller_1.requestChangeEmailController);
changeEmailRouter.post("/change-email", changeEmail_controller_1.changeEmailController);
exports.default = changeEmailRouter;
