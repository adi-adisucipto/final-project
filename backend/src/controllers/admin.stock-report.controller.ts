import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";
import { getStockReport } from "../services/admin.stock-report.service";

const parseString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isMonth = (value: string) => /^\d{4}-\d{2}$/.test(value);

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

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export async function getStockReportController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let month = parseString(req.query.month) || getCurrentMonth();
    if (!isMonth(month)) throw createCustomError(400, "month");

    let storeId = parseString(req.query.storeId) || undefined;
    if (req.user?.role === "admin") {
      storeId = await getStoreIdForAdmin(req.user.id);
    }

    const data = await getStockReport({ storeId, month });
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}
