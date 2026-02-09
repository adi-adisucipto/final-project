"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const prisma_1 = require("../lib/prisma");
const customError_1 = require("../utils/customError");
class OrderService {
    generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0");
        return `ORD-${timestamp}-${random}`;
    }
    async createOrder(data) {
        const { userId, userAddressId, storeId, items, subtotal, shippingCost, discountAmount, totalAmount, voucherCodeUsed, paymentMethod, } = data;
        const userAddress = await prisma_1.prisma.userAddress.findUnique({
            where: { id: userAddressId },
        });
        if (!userAddress || userAddress.user_id !== userId) {
            throw (0, customError_1.createCustomError)(404, "Address not found");
        }
        const store = await prisma_1.prisma.store.findUnique({
            where: { id: storeId },
        });
        if (!store) {
            throw (0, customError_1.createCustomError)(404, "Store not found");
        }
        for (const item of items) {
            const product = await prisma_1.prisma.product.findUnique({
                where: { id: item.productId },
                include: {
                    stocks: {
                        where: { storeId },
                    },
                },
            });
            if (!product) {
                throw (0, customError_1.createCustomError)(404, `Product ${item.productId} not found`);
            }
            if (!product.isActive) {
                throw (0, customError_1.createCustomError)(400, `Product ${product.name} is not available`);
            }
            const stock = product.stocks[0];
            if (!stock || stock.quantity < item.quantity) {
                throw (0, customError_1.createCustomError)(400, `Insufficient stock for product ${product.name}`);
            }
        }
        const initialStatus = paymentMethod === "TRANSFER" ? "WAITING_PAYMENT" : "WAITING_CONFIRMATION";
        const order = await prisma_1.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    orderNumber: this.generateOrderNumber(),
                    userId,
                    userAddressId,
                    storeId,
                    subtotal,
                    shippingCost,
                    discountAmount,
                    totalAmount,
                    voucherCodeUsed,
                    status: initialStatus,
                },
            });
            for (const item of items) {
                await tx.orderItem.create({
                    data: {
                        orderId: newOrder.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        subtotal: item.price * item.quantity,
                    },
                });
                const productStock = await tx.productStock.findFirst({
                    where: {
                        productId: item.productId,
                        storeId,
                    },
                });
                if (productStock) {
                    await tx.productStock.update({
                        where: { id: productStock.id },
                        data: {
                            quantity: {
                                decrement: item.quantity,
                            },
                        },
                    });
                    await tx.stockJournal.create({
                        data: {
                            productStockId: productStock.id,
                            action: "OUT",
                            quantity: item.quantity,
                            note: `Order ${newOrder.orderNumber}`,
                        },
                    });
                }
            }
            await tx.cart.deleteMany({
                where: { userId },
            });
            return newOrder;
        });
        const orderWithDetails = await prisma_1.prisma.order.findUnique({
            where: { id: order.id },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                images: { take: 1 },
                            },
                        },
                    },
                },
                userAddress: true,
                store: true,
            },
        });
        return orderWithDetails;
    }
    async uploadPaymentProof(orderId, userId, proofUrl) {
        const order = await prisma_1.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw (0, customError_1.createCustomError)(404, "Order not found");
        }
        if (order.userId !== userId) {
            throw (0, customError_1.createCustomError)(403, "Forbidden");
        }
        if (order.status !== "WAITING_PAYMENT") {
            throw (0, customError_1.createCustomError)(400, "Order is not waiting for payment");
        }
        const updatedOrder = await prisma_1.prisma.order.update({
            where: { id: orderId },
            data: {
                paymentProof: proofUrl,
                status: "WAITING_CONFIRMATION",
            },
        });
        return updatedOrder;
    }
    async getOrderById(orderId, userId) {
        const order = await prisma_1.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                images: { take: 1 },
                            },
                        },
                    },
                },
                userAddress: true,
                store: true,
            },
        });
        if (!order) {
            throw (0, customError_1.createCustomError)(404, "Order not found");
        }
        if (order.userId !== userId) {
            throw (0, customError_1.createCustomError)(403, "Forbidden");
        }
        return order;
    }
    async getUserOrders(userId) {
        const orders = await prisma_1.prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                images: { take: 1 },
                            },
                        },
                    },
                },
                store: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return orders;
    }
}
exports.OrderService = OrderService;
