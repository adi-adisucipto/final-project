"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const prisma_1 = require("../lib/prisma");
const customError_1 = require("../utils/customError");
class CartService {
    async getCart(userId) {
        const cartItems = await prisma_1.prisma.cart.findMany({
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
    async addToCart(userId, productId, storeId, quantity = 1) {
        if (quantity <= 0) {
            throw (0, customError_1.createCustomError)(400, "Quantity must be greater than 0");
        }
        const product = await prisma_1.prisma.product.findUnique({
            where: { id: productId },
            include: {
                stocks: {
                    where: { storeId },
                },
            },
        });
        if (!product) {
            throw (0, customError_1.createCustomError)(404, "Product not found");
        }
        if (!product.isActive) {
            throw (0, customError_1.createCustomError)(400, "Product is not available");
        }
        const stock = product.stocks[0];
        if (!stock || stock.quantity < quantity) {
            throw (0, customError_1.createCustomError)(400, "Not enough stock available");
        }
        const existingCartItem = await prisma_1.prisma.cart.findFirst({
            where: {
                userId,
                productId,
                storeId,
            },
        });
        if (existingCartItem) {
            const newQuantity = existingCartItem.quantity + quantity;
            if (stock.quantity < newQuantity) {
                throw (0, customError_1.createCustomError)(400, "Not enough stock available");
            }
            const updatedItem = await prisma_1.prisma.cart.update({
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
        const cartItem = await prisma_1.prisma.cart.create({
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
    async updateCartItem(cartItemId, userId, quantity) {
        if (quantity < 0) {
            throw (0, customError_1.createCustomError)(400, "Quantity cannot be negative");
        }
        const cartItem = await prisma_1.prisma.cart.findUnique({
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
            throw (0, customError_1.createCustomError)(404, "Cart item not found");
        }
        if (cartItem.userId !== userId) {
            throw (0, customError_1.createCustomError)(403, "Forbidden");
        }
        if (quantity === 0) {
            await prisma_1.prisma.cart.delete({
                where: { id: cartItemId },
            });
            return { deleted: true };
        }
        const stock = cartItem.product.stocks.find((s) => s.storeId === cartItem.storeId);
        if (!stock || stock.quantity < quantity) {
            throw (0, customError_1.createCustomError)(400, "Not enough stock available");
        }
        const updatedItem = await prisma_1.prisma.cart.update({
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
    async removeCartItem(cartItemId, userId) {
        const cartItem = await prisma_1.prisma.cart.findUnique({
            where: { id: cartItemId },
        });
        if (!cartItem) {
            throw (0, customError_1.createCustomError)(404, "Cart item not found");
        }
        if (cartItem.userId !== userId) {
            throw (0, customError_1.createCustomError)(403, "Forbidden");
        }
        await prisma_1.prisma.cart.delete({
            where: { id: cartItemId },
        });
        return { deleted: true };
    }
    async clearCart(userId) {
        const result = await prisma_1.prisma.cart.deleteMany({
            where: { userId },
        });
        return {
            deleted: true,
            count: result.count,
        };
    }
    async getCartCount(userId) {
        const count = await prisma_1.prisma.cart.aggregate({
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
exports.CartService = CartService;
