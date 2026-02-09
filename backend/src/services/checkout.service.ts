import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";

interface CreateOrderInput {
  userId: string;
  userAddressId: string;
  storeId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  voucherCodeUsed?: string;
  paymentMethod: "TRANSFER" | "COD";
}

export class OrderService {
  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `ORD-${timestamp}-${random}`;
  }

  async createOrder(data: CreateOrderInput) {
    const {
      userId,
      userAddressId,
      storeId,
      items,
      subtotal,
      shippingCost,
      discountAmount,
      totalAmount,
      voucherCodeUsed,
      paymentMethod,
    } = data;

    const userAddress = await prisma.userAddress.findUnique({
      where: { id: userAddressId },
    });

    if (!userAddress || userAddress.user_id !== userId) {
      throw createCustomError(404, "Address not found");
    }
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw createCustomError(404, "Store not found");
    }

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          stocks: {
            where: { storeId },
          },
        },
      });

      if (!product) {
        throw createCustomError(404, `Product ${item.productId} not found`);
      }

      if (!product.isActive) {
        throw createCustomError(400, `Product ${product.name} is not available`);
      }

      const stock = product.stocks[0];
      if (!stock || stock.quantity < item.quantity) {
        throw createCustomError(
          400,
          `Insufficient stock for product ${product.name}`
        );
      }
    }

    const initialStatus =
      paymentMethod === "TRANSFER" ? "WAITING_PAYMENT" : "WAITING_CONFIRMATION";

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: this.generateOrderNumber(),
          userId,
          userAddressId,
          storeId,
          subtotal,
          shippingCost,
          discountAmount,
          shippingDiscount: 0,
          totalAmount,
          voucherCodeUsed,
          status: initialStatus,
          updatedAt: new Date(),
        },
      });

      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            discountAmount: 0,
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

    const orderWithDetails = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        userAddress: {
          include: {
            userCity: true,
            provinceId: true,
          },
        },
        store: true,
      },
    });

    return orderWithDetails;
  }

  async uploadPaymentProof(orderId: string, userId: string, proofUrl: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw createCustomError(404, "Order not found");
    }

    if (order.userId !== userId) {
      throw createCustomError(403, "Forbidden");
    }

    if (order.status !== "WAITING_PAYMENT") {
      throw createCustomError(400, "Order is not waiting for payment");
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentProof: proofUrl,
        status: "WAITING_CONFIRMATION",
        updatedAt: new Date(),
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        userAddress: {
          include: {
            userCity: true,
            provinceId: true,
          },
        },
      },
    });

    return updatedOrder;
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        userAddress: {
          include: {
            userCity: true,
            provinceId: true,
          },
        },
        store: true,
      },
    });

    if (!order) {
      throw createCustomError(404, "Order not found");
    }
    if (order.userId !== userId) {
      throw createCustomError(403, "Forbidden");
    }

    return order;
  }

  async getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      userAddress: {
        include: {
          userCity: true,
          provinceId: true,
        },
      },
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders.map(order => ({
    ...order,
    items: order.orderItems.map(item => ({
      id: item.id,
      productId: item.productId,
      price: item.price,
      quantity: item.quantity,
      discountAmount: item.discountAmount,
      subtotal: item.subtotal,
      product: {
        name: item.product.name,
        images: item.product.images,
      },
    })),
  }));
}
}