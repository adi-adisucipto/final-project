import { Router } from "express";
import {
  deleteUserController,
  listUsersController,
  updateUserRoleController,
} from "../controllers/admin.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const adminRouter = Router();

adminRouter.use(authMiddleware, adminMiddleware);

adminRouter.get("/users", listUsersController);
adminRouter.patch("/users/:userId/role", updateUserRoleController);
adminRouter.delete("/users/:userId", deleteUserController);

export default adminRouter;
