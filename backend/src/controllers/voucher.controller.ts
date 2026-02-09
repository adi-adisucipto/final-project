import { Request, Response, NextFunction } from "express";
import { createVoucherService } from "../services/voucher.service";

export async function createVoucherController(req:Request, res:Response, next:NextFunction) {
    try {
        const { voucherCode, discountType, discountValue } = req.body;
        const rawPayload = {
            voucherCode: voucherCode,
            discountType: discountType,
            discountValue: discountValue
        }
        const result = await createVoucherService(rawPayload);

        res.status(201).json({
            message: 'Voucher has created successfully',
            data: result
        })
    } catch (error) {
        next(error);
    }
}