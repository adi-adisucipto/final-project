import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { OrderController } from "../controllers/checkout.controller";

const router = Router();
const orderController = new OrderController();

router.use(authMiddleware);

router.post("/", orderController.createOrder);
router.get("/", orderController.getUserOrders);
router.get("/:id", orderController.getOrderById);
router.post("/:id/payment", orderController.uploadPaymentProof);

export default router;