import { Router } from "express";
import { deleteAddressController, getAddressByIdController, getAddressController, getCitiesController, getProvincesController, syncRajaOngkirCitiesController, syncRajaOngkirProvincesController, userAddressController } from "../controllers/address.controller";

const addressRouter = Router();

addressRouter.get("/provinces", getProvincesController);
addressRouter.post("/cities", getCitiesController);
addressRouter.post("/user-address", userAddressController);
addressRouter.post("/address", getAddressController);
addressRouter.post("/delete-address", deleteAddressController);
addressRouter.post('/address-id', getAddressByIdController);

// addressRouter.get("/provinces", syncRajaOngkirProvincesController);
// addressRouter.get('/cities', syncRajaOngkirCitiesController);


export default addressRouter