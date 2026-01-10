import { Request, Response, NextFunction } from "express";
import { createCustomError } from "../utils/customError";

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw createCustomError(401, "Unauthorized!");
    }

    if (req.user.role !== "admin" && req.user.role !== "super") {
      throw createCustomError(403, "Forbidden");
    }

    next();
  } catch (error) {
    next(error);
  }
}
