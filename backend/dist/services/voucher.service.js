"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoucherService = createVoucherService;
const prisma_1 = require("../lib/prisma");
const voucher_validation_1 = require("../validations/voucher.validation");
async function createVoucherService(rawPayload) {
    const payload = voucher_validation_1.createVoucherSchema.parse(rawPayload);
    const newVoucher = await prisma_1.prisma.voucher.create({
        data: {
            voucher_code: payload.voucherCode,
            discount_type: payload.discountType,
            discount_value: payload.discountValue
        }
    });
    return newVoucher;
}
