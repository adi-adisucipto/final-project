"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const productRouter = (0, express_1.Router)();
productRouter.get("/", product_controller_1.listProductsController);
productRouter.get("/categories", product_controller_1.listProductCategoriesController);
productRouter.get("/:id", product_controller_1.getProductDetailController);
exports.default = productRouter;
