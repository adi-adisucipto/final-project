"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesReportController = getSalesReportController;
const prisma_1 = require("../lib/prisma");
const customError_1 = require("../utils/customError");
const admin_sales_report_service_1 = require("../services/admin.sales-report.service");
const parseString = (value) => typeof value === "string" ? value.trim() : "";
const isMonth = (value) => /^\d{4}-\d{2}$/.test(value);
const getStoreIdForAdmin = async (userId) => {
    const storeAdmin = await prisma_1.prisma.storeAdmin.findUnique({
        where: { userId },
        select: { storeId: true },
    });
    if (!storeAdmin) {
        throw (0, customError_1.createCustomError)(403, "storeId");
    }
    return storeAdmin.storeId;
};
const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};
async function getSalesReportController(req, res, next) {
    try {
        let month = parseString(req.query.month) || getCurrentMonth();
        if (!isMonth(month))
            throw (0, customError_1.createCustomError)(400, "month");
        let storeId = parseString(req.query.storeId) || undefined;
        if (req.user?.role === "admin") {
            storeId = await getStoreIdForAdmin(req.user.id);
        }
        const data = await (0, admin_sales_report_service_1.getSalesReport)({ storeId, month });
        res.status(200).json({ data });
    }
    catch (error) {
        next(error);
    }
}
