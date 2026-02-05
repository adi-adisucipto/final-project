"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const checkout_controller_1 = require("../controllers/checkout.controller");
const uploader_1 = __importDefault(require("../utils/uploader"));
const checkoutRouter = (0, express_1.Router)();
const orderController = new checkout_controller_1.OrderController();
checkoutRouter.use(auth_middleware_1.authMiddleware);
checkoutRouter.post("/", orderController.createOrder);
checkoutRouter.get("/", orderController.getUserOrders);
checkoutRouter.get("/:id", orderController.getOrderById);
checkoutRouter.post("/:id/payment", (0, uploader_1.default)().single("file"), orderController.uploadPaymentProof);
exports.default = checkoutRouter;
