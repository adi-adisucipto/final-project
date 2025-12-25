import { Router } from "express";
import { createRegisTokenController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/registration", createRegisTokenController);

export default authRouter