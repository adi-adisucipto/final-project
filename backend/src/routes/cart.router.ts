import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CartController } from "../controllers/cart.controller";

const router = Router();
const cartController = new CartController();

router.use(authMiddleware);

router.get("/count", cartController.getCartCount);

router.get("/", cartController.getCart);

router.post("/", cartController.addToCart);

router.patch("/:id", cartController.updateCartItem);

router.delete("/:id", cartController.removeCartItem);

router.delete("/", cartController.clearCart);

export default router;