import { Router } from "express";
import {
  deleteUserController,
  listUsersController,
  updateUserRoleController,
} from "../controllers/admin.controller";
import {
  createAdminProductController,
  deleteAdminProductController,
  listAdminProductsController,
  updateAdminProductController,
} from "../controllers/admin.product.controller";
import { uploadAdminProductImagesController } from "../controllers/admin.product.images.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import uploader from "../utils/uploader";

const adminRouter = Router();

adminRouter.use(authMiddleware, adminMiddleware);

adminRouter.get("/users", listUsersController);
adminRouter.patch("/users/:userId/role", updateUserRoleController);
adminRouter.delete("/users/:userId", deleteUserController);
adminRouter.get("/products", listAdminProductsController);
adminRouter.post("/products", createAdminProductController);
adminRouter.patch("/products/:productId", updateAdminProductController);
adminRouter.post(
  "/products/:productId/images",
  uploader().array("images", 5),
  uploadAdminProductImagesController
);
adminRouter.delete("/products/:productId", deleteAdminProductController);

export default adminRouter;
