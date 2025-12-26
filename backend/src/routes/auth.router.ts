import { Router } from "express";
import { createRegisTokenController, createUserController, loginController, refreshTokenController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/registration", createRegisTokenController);
authRouter.post("/verification", createUserController);
authRouter.post("/login", loginController);
authRouter.post("/refresh", refreshTokenController);

export default authRouter