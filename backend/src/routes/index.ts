import { Router } from "express";
import authRouter from "./auth.router";
import profileRouter from "./profile.router";
import addressRouter from "./address.router";
import adminRouter from "./admin.router";
import storeRouter from "./store.router";
import shippingRouter from "./shippingCost.router";
import nearStoreRouter from "./nearStore.router";
import storeAdminrouter from "./storeAdmin.orders.route";
import cartrouter from "./cart.router";
import paymentProofRouter from "./PaymentProof.router";
import checkoutRouter from "./checkout.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", profileRouter);
router.use("/address", addressRouter);
router.use("/admin", adminRouter);
router.use("/store", storeRouter);
router.use("/shipping", shippingRouter);
router.use("/stores", nearStoreRouter);
router.use("/store-admin/orders", storeAdminrouter);
router.use("/cart", cartrouter);
router.use("/orders", checkoutRouter);
router.use("/upload", paymentProofRouter);

export default router;
