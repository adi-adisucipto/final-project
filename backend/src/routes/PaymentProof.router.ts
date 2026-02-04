import { Router } from "express";
import { OrderController } from "../controllers/checkout.controller";
import uploader from "../utils/uploader";

const paymentProofRouter = Router();
const orderController = new OrderController();

paymentProofRouter.post(
  "/payment-proof",
  uploader().single("file"),
  orderController.uploadPaymentProofFile
);

export default paymentProofRouter;