import { Router } from "express";
import { changePasswordController, sendEmailChangePasswordController, updateUserController } from "../controllers/profile.controller";
import uploader from "../utils/uploader";
import { authMiddleware } from "../middlewares/auth.middleware";

const profileRouter = Router();

// profileRouter.use(authMiddleware);

profileRouter.post("/update-profile", authMiddleware ,uploader().single("avatar"), updateUserController);
profileRouter.post("/change-password", sendEmailChangePasswordController);
profileRouter.post("/password-change", changePasswordController)

export default profileRouter