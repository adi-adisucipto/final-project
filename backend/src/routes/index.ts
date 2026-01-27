import { Router } from "express";
import authRouter from "./auth.router";
import profileRouter from "./profile.router";
import addressRouter from "./address.router";
import adminRouter from "./admin.router";
import storeRouter from "./store.router";
import shippingRouter from "./shippingCost.router";
<<<<<<< HEAD
import nearStoreRouter from "./nearStore.router";
=======
import productRouter from "./product.router";
>>>>>>> 6a449d8 (restore missing files)

const router = Router();

router.use("/auth", authRouter);
router.use("/user", profileRouter);
router.use("/address", addressRouter);
router.use("/admin", adminRouter);
router.use("/store", storeRouter);
<<<<<<< HEAD
router.use("/shipping", shippingRouter);
router.use("/stores", nearStoreRouter);
=======
router.use("/shipping", shippingRouter)
router.use("/products", productRouter);
>>>>>>> 6a449d8 (restore missing files)

export default router;
