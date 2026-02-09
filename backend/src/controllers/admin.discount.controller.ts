import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";
import {
  createAdminDiscount,
  deleteAdminDiscount,
  updateAdminDiscount,
} from "../services/admin.discount.service";
import {
  listAdminDiscounts,
  listDiscountProducts,
} from "../services/admin.discount.list";

const parseString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";
const parseNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};
const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
const getStoreIdForAdmin = async (userId: string) => {
  const storeAdmin = await prisma.storeAdmin.findUnique({
    where: { userId },
    select: { storeId: true },
  });
  if (!storeAdmin) {
    throw createCustomError(403, "storeId");
  }
  return storeAdmin.storeId;
};

export async function listAdminDiscountsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pageRaw = parseNumber(req.query.page);
    let page = 1;
    if (pageRaw !== undefined && pageRaw > 0) page = Math.floor(pageRaw);

    const limitRaw = parseNumber(req.query.limit);
    let limit = 10;
    if (limitRaw !== undefined && limitRaw > 0) limit = Math.floor(limitRaw);
    if (limit > 50) limit = 50;

    const search = parseString(req.query.search) || undefined;

    let storeId = parseString(req.query.storeId) || undefined;
    if (storeId && !isUuid(storeId)) throw createCustomError(400, "storeId");

    if (req.user?.role === "admin") {
      storeId = await getStoreIdForAdmin(req.user.id);
    }

    const data = await listAdminDiscounts({ page, limit, search, storeId });
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}
export async function listDiscountProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let storeId = parseString(req.query.storeId);
    if (req.user?.role === "admin") {
      storeId = await getStoreIdForAdmin(req.user.id);
    }
    if (!storeId || !isUuid(storeId)) throw createCustomError(400, "storeId");
    const data = await listDiscountProducts(storeId);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}
export async function createAdminDiscountController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let storeId = parseString(req.body.storeId);
    if (req.user?.role === "admin") {
      storeId = await getStoreIdForAdmin(req.user.id);
    }
    if (!storeId || !isUuid(storeId)) throw createCustomError(400, "storeId");

    const productId = parseString(req.body.productId);
    if (!productId) throw createCustomError(400, "productId");

    const rule = parseString(req.body.rule);
    if (!["MANUAL", "MIN_PURCHASE", "BOGO"].includes(rule)) {
      throw createCustomError(400, "rule");
    }

    const type = parseString(req.body.type);
    if (!["PERCENT", "NOMINAL"].includes(type)) {
      throw createCustomError(400, "type");
    }

    const value = parseNumber(req.body.value) || 0;
    const minPurchase = parseNumber(req.body.minPurchase);
    const maxDiscount = parseNumber(req.body.maxDiscount);

    const id = await createAdminDiscount({
      storeId,
      productId,
      rule: rule as "MANUAL" | "MIN_PURCHASE" | "BOGO",
      type: type as "PERCENT" | "NOMINAL",
      value,
      minPurchase,
      maxDiscount,
    });
    res.status(201).json({ data: { id } });
  } catch (error) {
    next(error);
  }
}
export async function updateAdminDiscountController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const discountId = parseString(req.params.discountId);
    if (!discountId || !isUuid(discountId)) {
      throw createCustomError(400, "discountId");
    }

    let storeId = parseString(req.body.storeId);
    if (req.user?.role === "admin") {
      storeId = await getStoreIdForAdmin(req.user.id);
    }
    if (!storeId || !isUuid(storeId)) throw createCustomError(400, "storeId");

    const productId = parseString(req.body.productId);
    if (!productId) throw createCustomError(400, "productId");

    const rule = parseString(req.body.rule);
    if (!["MANUAL", "MIN_PURCHASE", "BOGO"].includes(rule)) {
      throw createCustomError(400, "rule");
    }

    const type = parseString(req.body.type);
    if (!["PERCENT", "NOMINAL"].includes(type)) {
      throw createCustomError(400, "type");
    }

    const value = parseNumber(req.body.value) || 0;
    const minPurchase = parseNumber(req.body.minPurchase);
    const maxDiscount = parseNumber(req.body.maxDiscount);

    await updateAdminDiscount(discountId, {
      storeId,
      productId,
      rule: rule as "MANUAL" | "MIN_PURCHASE" | "BOGO",
      type: type as "PERCENT" | "NOMINAL",
      value,
      minPurchase,
      maxDiscount,
    });

    res.status(200).json({ data: { id: discountId } });
  } catch (error) {
    next(error);
  }
}
export async function deleteAdminDiscountController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const discountId = parseString(req.params.discountId);
    if (!discountId || !isUuid(discountId)) {
      throw createCustomError(400, "discountId");
    }

    let storeId: string | undefined;
    if (req.user?.role === "admin") {
      storeId = await getStoreIdForAdmin(req.user.id);
    }

    await deleteAdminDiscount(discountId, storeId);
    res.status(200).json({ message: "Discount deleted" });
  } catch (error) {
    next(error);
  }
}
