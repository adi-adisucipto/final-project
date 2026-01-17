import { Request, Response, NextFunction } from "express";
import { CartService } from "../services/cart.service";

const cartService = new CartService();

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const cart = await cartService.getCart(userId);

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { productId, storeId, quantity = 1 } = req.body;

      if (!productId || !storeId) {
        return res.status(400).json({
          success: false,
          message: "Product ID and Store ID are required",
        });
      }

      const cartItem = await cartService.addToCart(
        userId,
        productId,
        storeId,
        quantity
      );

      res.status(201).json({
        success: true,
        message: "Item added to cart",
        data: cartItem,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { quantity } = req.body;

      if (quantity === undefined) {
        return res.status(400).json({
          success: false,
          message: "Quantity is required",
        });
      }

      const result = await cartService.updateCartItem(id, userId, quantity);

      const isDeleted = typeof result === 'object' && result !== null && 'deleted' in result;

      res.status(200).json({
        success: true,
        message: isDeleted ? "Item removed from cart" : "Cart updated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      await cartService.removeCartItem(id, userId);

      res.status(200).json({
        success: true,
        message: "Item removed from cart",
      });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const result = await cartService.clearCart(userId);

      res.status(200).json({
        success: true,
        message: "Cart cleared",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCartCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const result = await cartService.getCartCount(userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}