import { Router } from "express";
import { mainStoreController, nearStoreController, productByStoreController } from "../controllers/nearStore.controller";

const nearStoreRouter = Router();

nearStoreRouter.post("/near-store", nearStoreController);
nearStoreRouter.get('/main-store/:storeId', mainStoreController);
nearStoreRouter.get('/products/:storeId', productByStoreController);

export default nearStoreRouter;