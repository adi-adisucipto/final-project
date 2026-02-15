"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreAdminOrdersController = void 0;
const orders_service_1 = require("../services/orders.service");
const client_1 = require("../generated/prisma/client");
const ordersService = new orders_service_1.OrdersService();
class StoreAdminOrdersController {
    async getOrders(req, res, next) {
        try {
            const { storeAdmin } = req;
            const { status, page = "1", limit = "10", search } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const result = await ordersService.getOrders({
                storeId: storeAdmin.storeId,
                status: status,
                page: pageNum,
                limit: limitNum,
                search: search
            });
            res.status(200).json({
                success: true,
                data: result.orders,
                pagination: result.pagination
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOrderById(req, res, next) {
        try {
            const { storeAdmin } = req;
            const { id } = req.params;
            const order = await ordersService.getOrderById(id, storeAdmin.storeId);
            res.status(200).json({
                success: true,
                data: order
            });
        }
        catch (error) {
            next(error);
        }
    }
    async approveOrder(req, res, next) {
        try {
            const { storeAdmin } = req;
            const { id } = req.params;
            const order = await ordersService.approveOrder(id, storeAdmin.storeId);
            res.status(200).json({
                success: true,
                message: "Order approved successfully",
                data: order
            });
        }
        catch (error) {
            next(error);
        }
    }
    async rejectOrder(req, res, next) {
        try {
            const { storeAdmin } = req;
            const { id } = req.params;
            const { reason } = req.body;
            const order = await ordersService.rejectOrder(id, storeAdmin.storeId, reason);
            res.status(200).json({
                success: true,
                message: "Order rejected successfully",
                data: order
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateOrderStatus(req, res, next) {
        try {
            const { storeAdmin } = req;
            const { id } = req.params;
            const { status } = req.body;
            if (!storeAdmin?.storeId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: "Status is required"
                });
            }
            if (!Object.values(client_1.OrderStatus).includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid order status"
                });
            }
            const updatedOrder = await ordersService.updateOrderStatus(id, storeAdmin.storeId, status);
            const statusLabels = {
                WAITING_PAYMENT: "Menunggu Pembayaran",
                WAITING_CONFIRMATION: "Menunggu Konfirmasi",
                CONFIRMED: "Dikonfirmasi",
                CANCELLED: "Dibatalkan",
                PRESCRIBED: "Dikemas",
                SHIPPED: "Dikirim",
                DELIVERED: "Terkirim"
            };
            return res.status(200).json({
                success: true,
                message: `Status pesanan berhasil diubah`,
                data: updatedOrder
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOrderStats(req, res, next) {
        try {
            const { storeAdmin } = req;
            const stats = await ordersService.getOrderStats(storeAdmin.storeId);
            res.status(200).json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StoreAdminOrdersController = StoreAdminOrdersController;
