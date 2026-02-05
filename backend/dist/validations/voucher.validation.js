"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoucherSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../generated/prisma/enums");
exports.createVoucherSchema = zod_1.z.object({
    voucherCode: zod_1.z.string()
        .min(3, { message: "Voucher code minimal 3 karakter" })
        .transform((val) => val.toUpperCase()),
    discountType: zod_1.z.nativeEnum(enums_1.DiscountType, {
        error: (issue) => "Tipe diskon harus NOMINAL atau PERCENTAGE"
    }),
    discountValue: zod_1.z.number({
        error: (issue) => {
            if (issue.input === undefined) {
                return "Nilai diskon wajib diisi";
            }
            return "Nilai diskon harus berupa angka";
        }
    })
        .positive({ message: "Nilai diskon harus lebih dari 0" })
        .max(10000000, { message: "Nilai diskon terlalu besar" }),
});
