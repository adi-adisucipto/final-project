import { Router } from "express";
import {
  deleteUserController,
  listUsersController,
  updateUserRoleController,
} from "../controllers/admin.controller";
import {
  createAdminCategoryController,
  deleteAdminCategoryController,
  listAdminCategoriesController,
  updateAdminCategoryController,
} from "../controllers/admin.category.controller";
import {
  createAdminDiscountController,
  deleteAdminDiscountController,
  listAdminDiscountsController,
  listDiscountProductsController,
  updateAdminDiscountController,
} from "../controllers/admin.discount.controller";
import {
  adjustInventoryController,
  deleteInventoryController,
  listInventoryController,
  listInventoryProductsController,
} from "../controllers/admin.inventory.controller";
import {
  createAdminProductController,
  deleteAdminProductController,
  listAdminProductsController,
  updateAdminProductController,
} from "../controllers/admin.product.controller";
import { uploadAdminProductImagesController } from "../controllers/admin.product.images.controller";
import { getSalesReportController } from "../controllers/admin.sales-report.controller";
import { getStockReportController } from "../controllers/admin.stock-report.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import uploader from "../utils/uploader";

const adminRouter = Router();

adminRouter.use(authMiddleware, adminMiddleware);

adminRouter.get("/users", listUsersController);
adminRouter.patch("/users/:userId/role", updateUserRoleController);
adminRouter.delete("/users/:userId", deleteUserController);
adminRouter.get("/categories", listAdminCategoriesController);
adminRouter.post("/categories", createAdminCategoryController);
adminRouter.patch("/categories/:categoryId", updateAdminCategoryController);
adminRouter.delete("/categories/:categoryId", deleteAdminCategoryController);
adminRouter.get("/discounts", listAdminDiscountsController);
adminRouter.get("/discounts/products", listDiscountProductsController);
adminRouter.post("/discounts", createAdminDiscountController);
adminRouter.patch("/discounts/:discountId", updateAdminDiscountController);
adminRouter.delete("/discounts/:discountId", deleteAdminDiscountController);
adminRouter.get("/inventory", listInventoryController);
adminRouter.get("/inventory/products", listInventoryProductsController);
adminRouter.post("/inventory/adjust", adjustInventoryController);
adminRouter.delete("/inventory/:stockId", deleteInventoryController);
adminRouter.get("/products", listAdminProductsController);
adminRouter.post("/products", createAdminProductController);
adminRouter.patch("/products/:productId", updateAdminProductController);
adminRouter.post(
  "/products/:productId/images",
  uploader().array("images", 5),
  uploadAdminProductImagesController
);
adminRouter.delete("/products/:productId", deleteAdminProductController);
adminRouter.get("/reports/sales", getSalesReportController);
adminRouter.get("/reports/stock", getStockReportController);

export default adminRouter;
