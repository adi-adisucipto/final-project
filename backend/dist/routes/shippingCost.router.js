"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shippingCost_controller_1 = require("../controllers/shippingCost.controller");
const shippingRouter = (0, express_1.Router)();
shippingRouter.post("/cost", shippingCost_controller_1.shippingCostCalculatingController);
exports.default = shippingRouter;
