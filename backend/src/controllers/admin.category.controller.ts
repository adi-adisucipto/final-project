import { Request, Response, NextFunction } from "express";
import { createCustomError } from "../utils/customError";
import {
  createAdminCategory,
  deleteAdminCategory,
  listAdminCategories,
  updateAdminCategory,
} from "../services/admin.category.service";

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

export async function listAdminCategoriesController(
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
    const data = await listAdminCategories({ page, limit, search });
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function createAdminCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const name = parseString(req.body.name);
    if (!name) throw createCustomError(400, "name");
    const data = await createAdminCategory(name);
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categoryId = parseString(req.params.categoryId);
    if (!categoryId || !isUuid(categoryId)) {
      throw createCustomError(400, "categoryId");
    }
    const name = parseString(req.body.name);
    if (!name) throw createCustomError(400, "name");
    const data = await updateAdminCategory(categoryId, name);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function deleteAdminCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categoryId = parseString(req.params.categoryId);
    if (!categoryId || !isUuid(categoryId)) {
      throw createCustomError(400, "categoryId");
    }
    await deleteAdminCategory(categoryId);
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    next(error);
  }
}
