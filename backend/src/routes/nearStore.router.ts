import { Router } from "express";
import { nearStoreController } from "../controllers/nearStore.controller";

const nearStoreRouter = Router();

nearStoreRouter.post("/near-store", nearStoreController);

export default nearStoreRouter;