import { Request, Response, NextFunction } from "express";
import { createCustomError } from "../utils/customError";
import {
  createAdminProduct,
  deleteAdminProduct,
  listAdminProducts,
  updateAdminProduct,
} from "../services/admin.product.service";

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

const parseSort = (
  value: unknown
): "newest" | "price_asc" | "price_desc" => {
  if (value === "price_asc" || value === "price_desc") return value;
  return "newest";
};

export async function listAdminProductsController(
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

    const sort = parseSort(req.query.sort);
    const params = {
      page,
      limit,
      search,
      categoryId,
      minPrice,
      maxPrice,
      sort,
    };
    const data = await listAdminProducts(params);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function createAdminProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const name = parseString(req.body.name);
    if (!name) throw createCustomError(400, "name");

    const description = parseString(req.body.description);
    if (!description) throw createCustomError(400, "description");

    const price = parseNumber(req.body.price);
    if (price === undefined || price <= 0) throw createCustomError(400, "price");

    const categoryId = parseString(req.body.categoryId);
    if (!categoryId) throw createCustomError(400, "categoryId");

    let isActive = true;
    if (req.body.isActive === false || req.body.isActive === "false") {
      isActive = false;
    }

    const data = await createAdminProduct({
      name,
      description,
      price,
      categoryId,
      isActive,
    });
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = parseString(req.params.productId);
    if (!productId || !isUuid(productId)) {
      throw createCustomError(400, "productId");
    }

    const name = parseString(req.body.name);
    if (!name) throw createCustomError(400, "name");

    const description = parseString(req.body.description);
    if (!description) throw createCustomError(400, "description");

    const price = parseNumber(req.body.price);
    if (price === undefined || price <= 0) throw createCustomError(400, "price");

    const categoryId = parseString(req.body.categoryId);
    if (!categoryId) throw createCustomError(400, "categoryId");

    let isActive: boolean | undefined;
    if (req.body.isActive === true || req.body.isActive === "true") {
      isActive = true;
    } else if (req.body.isActive === false || req.body.isActive === "false") {
      isActive = false;
    }

    const data = await updateAdminProduct({
      id: productId,
      name,
      description,
      price,
      categoryId,
      isActive,
    });
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function deleteAdminProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = parseString(req.params.productId);
    if (!productId || !isUuid(productId)) {
      throw createCustomError(400, "productId");
    }
    await deleteAdminProduct(productId);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
}
