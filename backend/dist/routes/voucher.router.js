"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voucher_controller_1 = require("../controllers/voucher.controller");
const voucherRouter = (0, express_1.Router)();
voucherRouter.post('/create-voucher', voucher_controller_1.createVoucherController);
exports.default = voucherRouter;
