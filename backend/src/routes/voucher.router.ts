import { Router } from "express";
import { createVoucherController } from "../controllers/voucher.controller";

const voucherRouter = Router();

voucherRouter.post('/create-voucher', createVoucherController);

export default voucherRouter