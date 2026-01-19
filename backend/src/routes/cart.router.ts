import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CartController } from "../controllers/cart.controller";

const cartrouter = Router();
const cartController = new CartController();

cartrouter.use(authMiddleware);

cartrouter.get("/count", cartController.getCartCount);
cartrouter.get("/", cartController.getCart);
cartrouter.post("/", cartController.addToCart);
cartrouter.patch("/:id", cartController.updateCartItem);
cartrouter.delete("/:id", cartController.removeCartItem);
cartrouter.delete("/", cartController.clearCart);

export default cartrouter;
