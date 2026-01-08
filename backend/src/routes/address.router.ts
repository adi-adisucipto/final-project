import { Router } from "express";
import { getCitiesController, getProvincesController, syncRajaOngkirCitiesController, syncRajaOngkirProvincesController, userAddressController } from "../controllers/address.controller";

const addressRouter = Router();

addressRouter.get("/provinces", getProvincesController);
addressRouter.post("/cities", getCitiesController);
addressRouter.post("/user-address", userAddressController);

// addressRouter.get("/provinces", syncRajaOngkirProvincesController);
// addressRouter.get('/cities', syncRajaOngkirCitiesController);


export default addressRouter