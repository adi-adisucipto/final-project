import { prisma } from "../lib/prisma";
import { DiscountRule, DiscountType } from "../generated/prisma/client";
import { createCustomError } from "../utils/customError";

export type DiscountPayload = {
  storeId: string;
  productId: string;
  rule: DiscountRule;
  type: DiscountType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
};

const getEndDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
};

export async function createAdminDiscount(payload: DiscountPayload) {
  if (!payload.storeId) throw createCustomError(400, "storeId");
  if (!payload.productId) throw createCustomError(400, "productId");

  let rule = payload.rule;
  let type = payload.type;
  let value = payload.value;
  let minPurchase = payload.minPurchase;
  let maxDiscount = payload.maxDiscount;

  if (rule === "BOGO") {
    type = "NOMINAL";
    value = 0;
    minPurchase = undefined;
    maxDiscount = undefined;
  } else {
    if (!value || value <= 0) throw createCustomError(400, "value");
    if (type === "PERCENT" && value > 100) {
      throw createCustomError(400, "value");
    }
  }

  if (rule === "MIN_PURCHASE") {
    if (!minPurchase || minPurchase <= 0) {
      throw createCustomError(400, "minPurchase");
    }
    if (!maxDiscount || maxDiscount <= 0) {
      throw createCustomError(400, "maxDiscount");
    }
  } else {
    minPurchase = undefined;
    maxDiscount = undefined;
  }

  const store = await prisma.store.findUnique({
    where: { id: payload.storeId },
    select: { id: true },
  });
  if (!store) throw createCustomError(404, "storeId");

  const product = await prisma.product.findUnique({
    where: { id: payload.productId },
    select: { id: true },
  });
  if (!product) throw createCustomError(404, "productId");

  const stock = await prisma.productStock.findUnique({
    where: {
      productId_storeId: {
        productId: payload.productId,
        storeId: payload.storeId,
      },
    },
    select: { id: true },
  });
  if (!stock) throw createCustomError(400, "productId");

  const discount = await prisma.discount.create({
    data: {
      storeId: payload.storeId,
      productId: payload.productId,
      rule,
      type,
      value,
      minPurchase,
      maxDiscount,
      startAt: new Date(),
      endAt: getEndDate(),
    },
  });

  return discount.id;
}

export async function updateAdminDiscount(
  discountId: string,
  payload: DiscountPayload
) {
  const discount = await prisma.discount.findUnique({
    where: { id: discountId },
  });
  if (!discount) throw createCustomError(404, "discountId");

  if (!payload.storeId) throw createCustomError(400, "storeId");
  if (discount.storeId !== payload.storeId) {
    throw createCustomError(403, "storeId");
  }

  let rule = payload.rule;
  let type = payload.type;
  let value = payload.value;
  let minPurchase = payload.minPurchase;
  let maxDiscount = payload.maxDiscount;

  if (rule === "BOGO") {
    type = "NOMINAL";
    value = 0;
    minPurchase = undefined;
    maxDiscount = undefined;
  } else {
    if (!value || value <= 0) throw createCustomError(400, "value");
    if (type === "PERCENT" && value > 100) {
      throw createCustomError(400, "value");
    }
  }

  if (rule === "MIN_PURCHASE") {
    if (!minPurchase || minPurchase <= 0) {
      throw createCustomError(400, "minPurchase");
    }
    if (!maxDiscount || maxDiscount <= 0) {
      throw createCustomError(400, "maxDiscount");
    }
  } else {
    minPurchase = undefined;
    maxDiscount = undefined;
  }

  const product = await prisma.product.findUnique({
    where: { id: payload.productId },
    select: { id: true },
  });
  if (!product) throw createCustomError(404, "productId");

  const stock = await prisma.productStock.findUnique({
    where: {
      productId_storeId: {
        productId: payload.productId,
        storeId: payload.storeId,
      },
    },
    select: { id: true },
  });
  if (!stock) throw createCustomError(400, "productId");

  await prisma.discount.update({
    where: { id: discountId },
    data: {
      productId: payload.productId,
      rule,
      type,
      value,
      minPurchase,
      maxDiscount,
    },
  });
}

export async function deleteAdminDiscount(discountId: string, storeId?: string) {
  const discount = await prisma.discount.findUnique({
    where: { id: discountId },
  });
  if (!discount) throw createCustomError(404, "discountId");
  if (storeId && discount.storeId !== storeId) {
    throw createCustomError(403, "storeId");
  }
  await prisma.discount.delete({ where: { id: discountId } });
}
