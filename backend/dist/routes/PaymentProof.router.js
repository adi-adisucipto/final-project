"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_controller_1 = require("../controllers/checkout.controller");
const uploader_1 = __importDefault(require("../utils/uploader"));
const paymentProofRouter = (0, express_1.Router)();
const orderController = new checkout_controller_1.OrderController();
paymentProofRouter.post("/payment-proof", (0, uploader_1.default)().single("file"), orderController.uploadPaymentProofFile);
exports.default = paymentProofRouter;
