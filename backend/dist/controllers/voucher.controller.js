"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoucherController = createVoucherController;
const voucher_service_1 = require("../services/voucher.service");
async function createVoucherController(req, res, next) {
    try {
        const { voucherCode, discountType, discountValue } = req.body;
        const rawPayload = {
            voucherCode: voucherCode,
            discountType: discountType,
            discountValue: discountValue
        };
        const result = await (0, voucher_service_1.createVoucherService)(rawPayload);
        res.status(201).json({
            message: 'Voucher has created successfully',
            data: result
        });
    }
    catch (error) {
        next(error);
    }
}
