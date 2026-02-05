import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/checkout.service";
import { cloudinaryUplaod } from "../utils/cloudinary";

const orderService = new OrderService();

export class OrderController {

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const {
        userAddressId,
        storeId,
        items,
        subtotal,
        shippingCost,
        discountAmount,
        totalAmount,
        voucherCodeUsed,
        paymentMethod,
      } = req.body;

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
    } catch (error) {
      next(error);
    }
  }

  async uploadPaymentProofFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }
      const uploadResult = await cloudinaryUplaod(req.file, "payment_proofs");

      return res.status(200).json({
        success: true,
        data: {
          url: uploadResult.secure_url,
        },
        message: "File uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadPaymentProof(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    let paymentProofUrl: string;

    if (req.body.paymentProofUrl) {
      paymentProofUrl = req.body.paymentProofUrl;
    }
    else if (req.file) {
      const uploadResult = await cloudinaryUplaod(req.file, "payment_proofs");
      paymentProofUrl = uploadResult.secure_url;
    }
    else {
      return res.status(400).json({
        success: false,
        message: "Payment Proof file is required",
      })
    }

    const order = await orderService.uploadPaymentProof(
      id,
      userId,
      paymentProofUrl
    );

    res.status(200).json({
      success: true,
      message: "Payment proof uploaded successfully",
      data: order,
    });
  } catch (error) {
    next(error);
    }
  }


  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const order = await orderService.getOrderById(id, userId);

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const orders = await orderService.getUserOrders(userId);

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }
}
