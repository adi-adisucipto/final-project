import { Request, Response, NextFunction } from "express";
import { createCustomError } from "../utils/customError";
import {
  adjustInventory,
  deleteInventory,
  listInventory,
  listInventoryProducts,
} from "../services/admin.inventory.service";

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

export async function listInventoryController(
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
    const storeId = parseString(req.query.storeId) || undefined;
    if (storeId && !isUuid(storeId)) throw createCustomError(400, "storeId");

    const data = await listInventory({ page, limit, search, storeId });
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function listInventoryProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const search = parseString(req.query.search) || undefined;
    const data = await listInventoryProducts(search);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function adjustInventoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const storeId = parseString(req.body.storeId);
    if (!storeId || !isUuid(storeId)) throw createCustomError(400, "storeId");

    const productId = parseString(req.body.productId);
    if (!productId || !isUuid(productId)) {
      throw createCustomError(400, "productId");
    }

    const action = parseString(req.body.action);
    if (action !== "IN" && action !== "OUT") {
      throw createCustomError(400, "action");
    }

    const quantity = parseNumber(req.body.quantity);
    if (quantity === undefined || quantity <= 0) {
      throw createCustomError(400, "quantity");
    }

    const note = parseString(req.body.note) || undefined;
    const data = await adjustInventory({
      storeId,
      productId,
      action,
      quantity,
      note,
    });
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function deleteInventoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const stockId = parseString(req.params.stockId);
    if (!stockId || !isUuid(stockId)) {
      throw createCustomError(400, "stockId");
    }
    await deleteInventory(stockId);
    res.status(200).json({ message: "Stock deleted" });
  } catch (error) {
    next(error);
  }
}
