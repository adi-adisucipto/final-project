import { Router } from "express";
import {
  getProductDetailController,
  listProductCategoriesController,
  listProductsController,
} from "../controllers/product.controller";

const productRouter = Router();

productRouter.get("/", listProductsController);
productRouter.get("/categories", listProductCategoriesController);
productRouter.get("/:id", getProductDetailController);

export default productRouter;
