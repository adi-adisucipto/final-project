import { Router } from "express";
import authRouter from "./auth.router";
import profileRouter from "./profile.router";
import addressRouter from "./address.router";
import adminRouter from "./admin.router";
import storeRouter from "./store.router";
import shippingRouter from "./shippingCost.router";
import nearStoreRouter from "./nearStore.router";
import changeEmailRouter from "./changeEmail.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", profileRouter);
router.use("/address", addressRouter);
router.use("/admin", adminRouter);
router.use("/store", storeRouter);
router.use("/shipping", shippingRouter);
router.use("/stores", nearStoreRouter);
router.use("/change-email", changeEmailRouter);

export default router;
