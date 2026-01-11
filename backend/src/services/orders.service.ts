import { prisma } from "../lib/prisma";
import { OrderStatus } from "../generated/prisma/client";
import { createCustomError } from "../utils/customError";

interface GetOrdersParams {
    storeId: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
}

export class OrdersService {
    async getOrders({
        storeId,
        status,
        page = 1,
        limit = 10,
        search
    }: {
        storeId: string;
        status?: string;
        page?: number;
        limit?: number;
        search?: string;
    }) {
        const skip = (page - 1) * limit;

        const where: any = { storeId };

        if (status && status !== "all") {
            where.status = status as OrderStatus;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
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
            prisma.order.count({ where })
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

    async getOrderById(orderId: string, storeId: string) {
        const order = await prisma.order.findFirst({
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
            throw createCustomError(404, "Order not found");
        }

        return order;
    }

    async approveOrder(orderId: string, storeId: string) {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                storeId,
                status: OrderStatus.WAITING_CONFIRMATION
            }
        });

        if (!order) {
            throw createCustomError(
                404,
                "Order not found or cannot be approved"
            );
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus.CONFIRMED,
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

    async rejectOrder(orderId: string, storeId: string, reason: string) {
        if (!reason) {
            throw createCustomError(400, "Cancellation reason is required");
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                storeId,
                status: OrderStatus.WAITING_CONFIRMATION
            }
        });

        if (!order) {
            throw createCustomError(
                404,
                "Order not found or cannot be rejected"
            );
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus.CANCELLED,
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

    async getOrderStats(storeId: string) {
        const [
            totalOrders,
            pendingOrders,
            confirmedOrders,
            cancelledOrders,
            totalRevenue
        ] = await Promise.all([
            prisma.order.count({
                where: { storeId }
            }),
            prisma.order.count({
                where: {
                    storeId,
                    status: OrderStatus.WAITING_CONFIRMATION
                }
            }),
            prisma.order.count({
                where: {
                    storeId,
                    status: OrderStatus.CONFIRMED
                }
            }),
            prisma.order.count({
                where: {
                    storeId,
                    status: OrderStatus.CANCELLED
                }
            }),
            prisma.order.aggregate({
                where: {
                    storeId,
                    status: {
                        in: [
                            OrderStatus.CONFIRMED,
                            OrderStatus.PRESCRIBED,
                            OrderStatus.SHIPPED,
                            OrderStatus.DELIVERED
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