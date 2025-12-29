import { Router } from "express";
import authRouter from "./auth.router";
import profileRouter from "./profile.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", profileRouter)

export default router;