import { Router } from "express";
import { createStoreController, deleteStoreController, getStoreController, updateStoreController } from "../controllers/store.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const storeRouter = Router();

storeRouter.post("/store-address", authMiddleware, createStoreController);
storeRouter.get("/stores", authMiddleware, getStoreController);
storeRouter.post("/delete", authMiddleware, deleteStoreController);
storeRouter.post("/update", authMiddleware, updateStoreController);

export default storeRouter