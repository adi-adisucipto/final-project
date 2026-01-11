import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowStoreAdmin } from "../middlewares/roleGuard.middleware";
import { StoreAdminOrdersController } from "../controllers/storeAdmin.orders.controller";

const storeAdminrouter = Router();
const ordersController = new StoreAdminOrdersController();

storeAdminrouter.use(authMiddleware, allowStoreAdmin());
storeAdminrouter.get("/stats", ordersController.getOrderStats);
storeAdminrouter.get("/", ordersController.getOrders);
storeAdminrouter.get("/:id", ordersController.getOrderById);
storeAdminrouter.patch("/:id/approve", ordersController.approveOrder);
storeAdminrouter.patch("/:id/reject", ordersController.rejectOrder);

export default storeAdminrouter;