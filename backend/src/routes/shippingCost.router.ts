import { Router } from "express";
import { shippingCostCalculatingController } from "../controllers/shippingCost.controller";

const shippingRouter = Router();

shippingRouter.post("/cost", shippingCostCalculatingController)

export default shippingRouter