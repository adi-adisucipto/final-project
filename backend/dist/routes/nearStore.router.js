"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nearStore_controller_1 = require("../controllers/nearStore.controller");
const nearStoreRouter = (0, express_1.Router)();
nearStoreRouter.post("/near-store", nearStore_controller_1.nearStoreController);
nearStoreRouter.get('/main-store/:storeId', nearStore_controller_1.mainStoreController);
nearStoreRouter.get('/products/:storeId', nearStore_controller_1.productByStoreController);
exports.default = nearStoreRouter;
