import { Router } from "express";
import { syncRajaOngkirCitiesController, syncRajaOngkirProvincesController } from "../controllers/address.controller";

const addressRouter = Router();

addressRouter.get("/provinces", syncRajaOngkirProvincesController);
addressRouter.get('/cities', syncRajaOngkirCitiesController);

export default addressRouter