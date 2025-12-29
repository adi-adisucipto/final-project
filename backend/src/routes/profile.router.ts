import { Router } from "express";
import { updateUserController } from "../controllers/profile.controller";
import uploader from "../utils/uploader";

const profileRouter = Router();

profileRouter.post("/update-profile", uploader().single("avatar"), updateUserController);

export default profileRouter