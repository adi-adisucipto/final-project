import { Request, Response, NextFunction } from "express";
import { OrdersService } from "../services/orders.service";

const ordersService = new OrdersService();

export class StoreAdminOrdersController {
    async getOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeAdmin } = req;
            const { status, page = "1", limit = "10", search } = req.query;

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);

            const result = await ordersService.getOrders({
                storeId: storeAdmin!.storeId,
                status: status as string,
                page: pageNum,
                limit: limitNum,
                search: search as string
            });

            res.status(200).json({
                success: true,
                data: result.orders,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    async getOrderById(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeAdmin } = req;
            const { id } = req.params;

            const order = await ordersService.getOrderById(
                id,
                storeAdmin!.storeId
            );

            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    async approveOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeAdmin } = req;
            const { id } = req.params;

            const order = await ordersService.approveOrder(
                id,
                storeAdmin!.storeId
            );

            res.status(200).json({
                success: true,
                message: "Order approved successfully",
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    async rejectOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeAdmin } = req;
            const { id } = req.params;
            const { reason } = req.body;

            const order = await ordersService.rejectOrder(
                id,
                storeAdmin!.storeId,
                reason
            );

            res.status(200).json({
                success: true,
                message: "Order rejected successfully",
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    async getOrderStats(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeAdmin } = req;

            const stats = await ordersService.getOrderStats(
                storeAdmin!.storeId
            );

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
}