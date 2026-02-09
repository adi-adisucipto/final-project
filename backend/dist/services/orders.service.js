"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const prisma_1 = require("../lib/prisma");
const client_1 = require("../generated/prisma/client");
const customError_1 = require("../utils/customError");
class OrdersService {
    async getOrders({ storeId, status, page = 1, limit = 10, search }) {
        const skip = (page - 1) * limit;
        const where = { storeId };
        if (status && status !== "all") {
            where.status = status;
        }
        const [orders, total] = await Promise.all([
            prisma_1.prisma.order.findMany({
                where,
                include: {
                    user: {
                        select: {
                            first_name: true,
                            last_name: true,
                            email: true
                        }
                    },
                    userAddress: {
                        select: {
                            address: true,
                            city: true,
                            province: true,
                            postal_code: true
                        }
                    },
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    price: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit
            }),
            prisma_1.prisma.order.count({ where })
        ]);
        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async getOrderById(orderId, storeId) {
        const order = await prisma_1.prisma.order.findFirst({
            where: {
                id: orderId,
                storeId
            },
            include: {
                user: {
                    select: {
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                },
                userAddress: true,
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
        if (!order) {
            throw (0, customError_1.createCustomError)(404, "Order not found");
        }
        return order;
    }
    async approveOrder(orderId, storeId) {
        const order = await prisma_1.prisma.order.findFirst({
            where: {
                id: orderId,
                storeId,
                status: client_1.OrderStatus.WAITING_CONFIRMATION
            }
        });
        if (!order) {
            throw (0, customError_1.createCustomError)(404, "Order not found or cannot be approved");
        }
        const updatedOrder = await prisma_1.prisma.order.update({
            where: { id: orderId },
            data: {
                status: client_1.OrderStatus.CONFIRMED,
                confirmedAt: new Date()
            },
            include: {
                user: {
                    select: {
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                },
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
        return updatedOrder;
    }
    async rejectOrder(orderId, storeId, reason) {
        if (!reason) {
            throw (0, customError_1.createCustomError)(400, "Cancellation reason is required");
        }
        const order = await prisma_1.prisma.order.findFirst({
            where: {
                id: orderId,
                storeId,
                status: client_1.OrderStatus.WAITING_CONFIRMATION
            }
        });
        if (!order) {
            throw (0, customError_1.createCustomError)(404, "Order not found or cannot be rejected");
        }
        const updatedOrder = await prisma_1.prisma.order.update({
            where: { id: orderId },
            data: {
                status: client_1.OrderStatus.CANCELLED,
                cancelledAt: new Date(),
                cancellationReason: reason
            },
            include: {
                user: {
                    select: {
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                }
            }
        });
        return updatedOrder;
    }
    async getOrderStats(storeId) {
        const [totalOrders, pendingOrders, confirmedOrders, cancelledOrders, totalRevenue] = await Promise.all([
            prisma_1.prisma.order.count({
                where: { storeId }
            }),
            prisma_1.prisma.order.count({
                where: {
                    storeId,
                    status: client_1.OrderStatus.WAITING_CONFIRMATION
                }
            }),
            prisma_1.prisma.order.count({
                where: {
                    storeId,
                    status: client_1.OrderStatus.CONFIRMED
                }
            }),
            prisma_1.prisma.order.count({
                where: {
                    storeId,
                    status: client_1.OrderStatus.CANCELLED
                }
            }),
            prisma_1.prisma.order.aggregate({
                where: {
                    storeId,
                    status: {
                        in: [
                            client_1.OrderStatus.CONFIRMED,
                            client_1.OrderStatus.PRESCRIBED,
                            client_1.OrderStatus.SHIPPED,
                            client_1.OrderStatus.DELIVERED
                        ]
                    }
                },
                _sum: { totalAmount: true }
            })
        ]);
        return {
            totalOrders,
            pendingOrders,
            confirmedOrders,
            cancelledOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0
        };
    }
}
exports.OrdersService = OrdersService;
