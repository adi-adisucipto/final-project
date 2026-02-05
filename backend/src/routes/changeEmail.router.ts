import { Router } from "express";
import { changeEmailController, requestChangeEmailController } from "../controllers/changeEmail.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const changeEmailRouter = Router();

changeEmailRouter.post("/request-change-email", authMiddleware, requestChangeEmailController);
changeEmailRouter.post("/change-email", changeEmailController);

export default changeEmailRouter