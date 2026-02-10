import { Request, Response, NextFunction } from "express";
import { createCustomError } from "../utils/customError";
import {
  getProductCatalog,
  getProductCategories,
  getProductDetail,
} from "../services/product.service";

const parseNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const parseSort = (
  value: unknown
): "newest" | "price_asc" | "price_desc" => {
  if (value === "price_asc" || value === "price_desc") return value;
  return "newest";
};

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );

export async function listProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pageRaw = parseNumber(req.query.page);
    let page = 1;
    if (pageRaw !== undefined && pageRaw > 0) page = Math.floor(pageRaw);

    const limitRaw = parseNumber(req.query.limit);
    let limit = 9;
    if (limitRaw !== undefined && limitRaw > 0) limit = Math.floor(limitRaw);
    if (limit > 30) limit = 30;

    const search = parseString(req.query.search);
    if (search.length > 80) throw createCustomError(400, "search too long");

    const categoryId = parseString(req.query.categoryId) || undefined;

    const minPrice = parseNumber(req.query.minPrice);
    if (minPrice !== undefined && minPrice < 0) {
      throw createCustomError(400, "minPrice");
    }
    const maxPrice = parseNumber(req.query.maxPrice);
    if (maxPrice !== undefined && maxPrice < 0) {
      throw createCustomError(400, "maxPrice");
    }
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      throw createCustomError(400, "minPrice > maxPrice");
    }

    const lat = parseNumber(req.query.lat);
    if (lat !== undefined && (lat < -90 || lat > 90)) {
      throw createCustomError(400, "lat");
    }
    const lng = parseNumber(req.query.lng);
    if (lng !== undefined && (lng < -180 || lng > 180)) {
      throw createCustomError(400, "lng");
    }

    const storeIdRaw = parseString(req.query.storeId);
    let storeId: string | undefined;
    if (storeIdRaw) {
      if (!isUuid(storeIdRaw)) throw createCustomError(400, "storeId");
      storeId = storeIdRaw;
    }

    const params = {
      page,
      limit,
      search,
      categoryId,
      minPrice,
      maxPrice,
      lat,
      lng,
      storeId,
      sort: parseSort(req.query.sort),
    };
    const data = await getProductCatalog(params);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function listProductCategoriesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await getProductCategories();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function getProductDetailController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = parseString(req.params.id);
    if (!productId || !isUuid(productId)) {
      throw createCustomError(400, "productId");
    }

    const storeIdRaw = parseString(req.query.storeId);
    let storeId: string | undefined;
    if (storeIdRaw) {
      if (!isUuid(storeIdRaw)) throw createCustomError(400, "storeId");
      storeId = storeIdRaw;
    }

    const lat = parseNumber(req.query.lat);
    if (lat !== undefined && (lat < -90 || lat > 90)) {
      throw createCustomError(400, "lat");
    }
    const lng = parseNumber(req.query.lng);
    if (lng !== undefined && (lng < -180 || lng > 180)) {
      throw createCustomError(400, "lng");
    }

    const params = { productId, storeId, lat, lng };
    const data = await getProductDetail(params);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}
