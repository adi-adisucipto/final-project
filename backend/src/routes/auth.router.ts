import { Router } from "express";
import { createRegisTokenController, createUserController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/registration", createRegisTokenController);
authRouter.post("/verification", createUserController);

export default authRouter