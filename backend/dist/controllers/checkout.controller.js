"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const checkout_service_1 = require("../services/checkout.service");
const cloudinary_1 = require("../utils/cloudinary");
const orderService = new checkout_service_1.OrderService();
class OrderController {
    async createOrder(req, res, next) {
        try {
            const userId = req.user.id;
            const { userAddressId, storeId, items, subtotal, shippingCost, discountAmount, totalAmount, voucherCodeUsed, paymentMethod, } = req.body;
            if (!userAddressId || !storeId || !items || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }
            if (!["TRANSFER", "COD"].includes(paymentMethod)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid payment method",
                });
            }
            const order = await orderService.createOrder({
                userId,
                userAddressId,
                storeId,
                items,
                subtotal,
                shippingCost,
                discountAmount,
                totalAmount,
                paymentMethod,
            });
            res.status(201).json({
                success: true,
                message: "Order created successfully",
                data: order,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async previewDiscounts(req, res, next) {
        try {
            const { storeId, items } = req.body;
            if (!storeId || !items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }
            const data = await orderService.previewDiscounts(storeId, items);
            res.status(200).json({
                success: true,
                data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async uploadPaymentProofFile(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded",
                });
            }
            const uploadResult = await (0, cloudinary_1.cloudinaryUplaod)(req.file, "payment_proofs");
            return res.status(200).json({
                success: true,
                data: {
                    url: uploadResult.secure_url,
                },
                message: "File uploaded successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async uploadPaymentProof(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            let paymentProofUrl;
            if (req.body.paymentProofUrl) {
                paymentProofUrl = req.body.paymentProofUrl;
            }
            else if (req.file) {
                const uploadResult = await (0, cloudinary_1.cloudinaryUplaod)(req.file, "payment_proofs");
                paymentProofUrl = uploadResult.secure_url;
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Payment Proof file is required",
                });
            }
            const order = await orderService.uploadPaymentProof(id, userId, paymentProofUrl);
            res.status(200).json({
                success: true,
                message: "Payment proof uploaded successfully",
                data: order,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOrderById(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const order = await orderService.getOrderById(id, userId);
            res.status(200).json({
                success: true,
                data: order,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserOrders(req, res, next) {
        try {
            const userId = req.user.id;
            const orders = await orderService.getUserOrders(userId);
            res.status(200).json({
                success: true,
                data: orders,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
