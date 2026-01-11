import { Router } from "express";
import { deleteAddressController, getAddressByIdController, getAddressController, getCitiesController, getProvincesController, syncRajaOngkirCitiesController, syncRajaOngkirProvincesController, updateAddressController, userAddressController } from "../controllers/address.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const addressRouter = Router();

addressRouter.get("/provinces", getProvincesController);
addressRouter.post("/cities", getCitiesController);
addressRouter.post("/address", getAddressController);

addressRouter.use(authMiddleware)

addressRouter.post('/address-id', getAddressByIdController);
addressRouter.post("/user-address", userAddressController);
addressRouter.post("/delete-address", deleteAddressController);
addressRouter.post("/update-address", updateAddressController);

// addressRouter.get("/provinces", syncRajaOngkirProvincesController);
// addressRouter.get('/cities', syncRajaOngkirCitiesController);


export default addressRouter