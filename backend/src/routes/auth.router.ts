import { Router } from "express";
import { createRegisTokenController, createUserController, googleLoginController, loginController, refreshTokenController } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/google.middleware";

const authRouter = Router();

authRouter.post("/registration", createRegisTokenController);
authRouter.post("/verification", createUserController);
authRouter.post("/login", loginController);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/google-login", verifyToken, googleLoginController)

export default authRouter