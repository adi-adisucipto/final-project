import {z} from "zod";
import { DiscountType } from "../generated/prisma/enums";

export const createVoucherSchema = z.object({
    voucherCode: z.string()
        .min(3, { message: "Voucher code minimal 3 karakter" })
        .transform((val) => val.toUpperCase()),
    
    discountType: z.nativeEnum(DiscountType, {
        error: (issue) => "Tipe diskon harus NOMINAL atau PERCENTAGE"
    }),

    discountValue: z.number({
        error: (issue) => {
            if (issue.input === undefined) {
                return "Nilai diskon wajib diisi";
            }
            return "Nilai diskon harus berupa angka";
        }
    })
    .positive({ message: "Nilai diskon harus lebih dari 0" })
    .max(10000000, { message: "Nilai diskon terlalu besar" }),
})

export type CreateVoucherInput = z.infer<typeof createVoucherSchema>;