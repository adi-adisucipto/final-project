import { Request, Response, NextFunction } from "express";
import { createCustomError } from "../utils/customError";
import { uploadAdminProductImages } from "../services/admin.product.images.service";

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );

const requireUuid = (value: unknown, field: string) => {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text || !isUuid(text)) throw createCustomError(400, field);
  return text;
};

const getFiles = (req: Request) => {
  const files = (req.files || []) as Express.Multer.File[];
  if (!files.length) throw createCustomError(400, "images");
  return files;
};

export async function uploadAdminProductImagesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = requireUuid(req.params.productId, "productId");
    const files = getFiles(req);
    const data = await uploadAdminProductImages(productId, files);
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}
