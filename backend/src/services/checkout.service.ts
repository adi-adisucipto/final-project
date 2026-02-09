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

  private async getActiveDiscounts(
    storeId: string,
    productIds: string[]
  ) {
    const now = new Date();
    return prisma.discount.findMany({
      where: {
        storeId,
        productId: { in: productIds },
        startAt: { lte: now },
        endAt: { gte: now },
      },
    });
  }

  private pickDiscount(
    discounts: Array<{
      id: string;
      rule: "MANUAL" | "MIN_PURCHASE" | "BOGO";
      type: "PERCENT" | "NOMINAL";
      value: any;
      minPurchase: any;
      maxDiscount: any;
    }>,
    lineSubtotal: number,
    quantity: number,
    orderSubtotal: number
  ) {
    const priority: Record<string, number> = {
      MANUAL: 1,
      MIN_PURCHASE: 2,
      BOGO: 3,
    };
    const sorted = [...discounts].sort(
      (a, b) => priority[a.rule] - priority[b.rule]
    );

    for (const discount of sorted) {
      if (discount.rule === "MIN_PURCHASE") {
        const minPurchase = Number(discount.minPurchase || 0);
        if (orderSubtotal < minPurchase) continue;
      }
      if (discount.rule === "BOGO" && quantity < 2) continue;

      let amount = 0;
      if (discount.rule === "BOGO") {
        const freeItems = Math.floor(quantity / 2);
        amount = (lineSubtotal / quantity) * freeItems;
      } else if (discount.type === "PERCENT") {
        amount = (lineSubtotal * Number(discount.value)) / 100;
      } else {
        amount = Number(discount.value);
      }

      const maxDiscount = discount.maxDiscount
        ? Number(discount.maxDiscount)
        : null;
      if (maxDiscount !== null && amount > maxDiscount) {
        amount = maxDiscount;
      }
      if (amount > lineSubtotal) amount = lineSubtotal;
      if (amount < 0) amount = 0;

      return { discountId: discount.id, amount };
    }

    return { discountId: null as string | null, amount: 0 };
  }

  private async calculateDiscounts(
    storeId: string,
    items: Array<{ productId: string; price: number; quantity: number }>,
    orderSubtotal: number
  ) {
    const productIds = items.map((item) => item.productId);
    const discounts = await this.getActiveDiscounts(storeId, productIds);

    const discountsByProduct = new Map<string, typeof discounts>();
    for (const discount of discounts) {
      const list = discountsByProduct.get(discount.productId) || [];
      list.push(discount);
      discountsByProduct.set(discount.productId, list);
    }

    const itemDiscounts = new Map<string, number>();
    const usageMap = new Map<string, number>();

    for (const item of items) {
      const lineSubtotal = item.price * item.quantity;
      const productDiscounts = discountsByProduct.get(item.productId) || [];
      const picked = this.pickDiscount(
        productDiscounts as any,
        lineSubtotal,
        item.quantity,
        orderSubtotal
      );
      itemDiscounts.set(item.productId, picked.amount);
      if (picked.discountId) {
        const prev = usageMap.get(picked.discountId) || 0;
        usageMap.set(picked.discountId, prev + picked.amount);
      }
    }

    const totalDiscount = Array.from(itemDiscounts.values()).reduce(
      (sum, value) => sum + value,
      0
    );

    return { totalDiscount, itemDiscounts, usageMap };
  }

  async previewDiscounts(
    storeId: string,
    items: Array<{ productId: string; price: number; quantity: number }>
  ) {
    if (!storeId) throw createCustomError(400, "storeId");
    if (!items || items.length === 0) throw createCustomError(400, "items");

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discountResult = await this.calculateDiscounts(
      storeId,
      items,
      subtotal
    );

    return {
      subtotal,
      discountAmount: discountResult.totalDiscount,
    };
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

    const computedSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discountResult = await this.calculateDiscounts(
      storeId,
      items,
      computedSubtotal
    );

    const safeDiscount = Number(discountAmount) || 0;
    const combinedDiscount = safeDiscount + discountResult.totalDiscount;
    const totalBeforeClamp =
      computedSubtotal + shippingCost - combinedDiscount;
    const computedTotal = totalBeforeClamp < 0 ? 0 : totalBeforeClamp;

    const initialStatus =
      paymentMethod === "TRANSFER" ? "WAITING_PAYMENT" : "WAITING_CONFIRMATION";

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: this.generateOrderNumber(),
          userId,
          userAddressId,
          storeId,
          subtotal: computedSubtotal,
          shippingCost,
          discountAmount: combinedDiscount,
          totalAmount: computedTotal,
          voucherCodeUsed,
          status: initialStatus,
        },
      });

      for (const item of items) {
        const lineSubtotal = item.price * item.quantity;
        const itemDiscount = discountResult.itemDiscounts.get(item.productId) || 0;
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            discountAmount: itemDiscount,
            subtotal: lineSubtotal - itemDiscount,
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
            },
          });
        }
      }
      await tx.cart.deleteMany({
        where: { userId },
      });

      if (discountResult.usageMap.size > 0) {
        const usageData = Array.from(discountResult.usageMap.entries()).map(
          ([discountId, amount]) => ({
            discountId,
            orderId: newOrder.id,
            amount,
          })
        );
        await tx.discountUsage.createMany({ data: usageData });
      }

      return newOrder;
    });

    const orderWithDetails = await prisma.order.findUnique({
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
