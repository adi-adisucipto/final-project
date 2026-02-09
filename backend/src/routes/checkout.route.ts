import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { OrderController } from "../controllers/checkout.controller";
import uploader from "../utils/uploader";

const checkoutRouter = Router();
const orderController = new OrderController();

checkoutRouter.use(authMiddleware);

checkoutRouter.post("/", orderController.createOrder);
checkoutRouter.post("/preview", orderController.previewDiscounts);
checkoutRouter.get("/", orderController.getUserOrders);
checkoutRouter.get("/:id", orderController.getOrderById);
checkoutRouter.post("/:id/payment",uploader().single("file"), orderController.uploadPaymentProof);

export default checkoutRouter;
