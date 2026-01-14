import { Router } from "express";
import { assignAdminController, createStoreController, deleteStoreController, getAdminsController, getStoreController, updateStoreController } from "../controllers/store.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const storeRouter = Router();

storeRouter.post("/store-address", authMiddleware, createStoreController);
storeRouter.get("/stores", authMiddleware, getStoreController);
storeRouter.post("/delete", authMiddleware, deleteStoreController);
storeRouter.post("/update", authMiddleware, updateStoreController);
storeRouter.get("/admins", getAdminsController);
storeRouter.post("/assign-admin", authMiddleware, assignAdminController);

export default storeRouter