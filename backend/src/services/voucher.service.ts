import { prisma } from "../lib/prisma";
import { createVoucherSchema } from "../validations/voucher.validation";

export async function createVoucherService(rawPayload: unknown) {
    const payload = createVoucherSchema.parse(rawPayload);
    const newVoucher = await prisma.voucher.create({
        data: {
            voucher_code: payload.voucherCode,
            discount_type: payload.discountType,
            discount_value: payload.discountValue
        }
    });

    return newVoucher;
}
