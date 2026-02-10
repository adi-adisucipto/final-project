import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";

export class CartService {
  async getCart(userId: string) {
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              take: 1,
            },
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            cityId: true,
          },
        },
      },
      orderBy: { product: { name: "asc" } },
    });

    const subtotal = cartItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: cartItems,
      summary: {
        totalItems,
        subtotal,
      },
    };
  }

  async addToCart(
    userId: string,
    productId: string,
    storeId: string,
    quantity: number = 1
  ) {
    if (quantity <= 0) {
      throw createCustomError(400, "Quantity must be greater than 0");
    }
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        stocks: {
          where: { storeId },
        },
      },
    });

    if (!product) {
      throw createCustomError(404, "Product not found");
    }

    if (!product.isActive) {
      throw createCustomError(400, "Product is not available");
    }

    const stock = product.stocks[0];
    if (!stock || stock.quantity < quantity) {
      throw createCustomError(400, "Not enough stock available");
    }

    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId,
        productId,
        storeId,
      },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;

      if (stock.quantity < newQuantity) {
        throw createCustomError(400, "Not enough stock available");
      }

      const updatedItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              images: { take: 1 },
            },
          },
          store: {
            select: {
              id: true,
              name: true,
              cityId: true,
            },
          },
        },
      });

      return updatedItem;
    }

    const cartItem = await prisma.cart.create({
      data: {
        userId,
        productId,
        storeId,
        quantity,
      },
      include: {
        product: {
          include: {
            images: { take: 1 },
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            cityId: true,
          },
        },
      },
    });

    return cartItem;
  }

  async updateCartItem(cartItemId: string, userId: string, quantity: number) {
    if (quantity < 0) {
      throw createCustomError(400, "Quantity cannot be negative");
    }

    const cartItem = await prisma.cart.findUnique({
      where: { id: cartItemId },
      include: {
        product: {
          include: {
            stocks: true,
          },
        },
      },
    });

    if (!cartItem) {
      throw createCustomError(404, "Cart item not found");
    }

    if (cartItem.userId !== userId) {
      throw createCustomError(403, "Forbidden");
    }

    if (quantity === 0) {
      await prisma.cart.delete({
        where: { id: cartItemId },
      });

      return { deleted: true };
    }

    const stock = cartItem.product.stocks.find(
      (s) => s.storeId === cartItem.storeId
    );

    if (!stock || stock.quantity < quantity) {
      throw createCustomError(400, "Not enough stock available");
    }

    const updatedItem = await prisma.cart.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: {
          include: {
            images: { take: 1 },
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            cityId: true,
          },
        },
      },
    });

    return updatedItem;
  }

  async removeCartItem(cartItemId: string, userId: string) {
    const cartItem = await prisma.cart.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw createCustomError(404, "Cart item not found");
    }

    if (cartItem.userId !== userId) {
      throw createCustomError(403, "Forbidden");
    }

    await prisma.cart.delete({
      where: { id: cartItemId },
    });

    return { deleted: true };
  }

  async clearCart(userId: string) {
    const result = await prisma.cart.deleteMany({
      where: { userId },
    });

    return {
      deleted: true,
      count: result.count,
    };
  }

  async getCartCount(userId: string) {
    const count = await prisma.cart.aggregate({
      where: { userId },
      _sum: {
        quantity: true,
      },
    });

    return {
      count: count._sum.quantity || 0,
    };
  }
}