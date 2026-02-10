import { Router } from "express";
import {
    deleteAddressController,
    getAddressByIdController,
    getAddressController,
    getCitiesController,
    getProvincesController,
    syncRajaOngkirCitiesController,
    syncRajaOngkirProvincesController,
    updateAddressController,
    createUserAddressController
} from "../controllers/address.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const addressRouter = Router();

addressRouter.get("/provinces", getProvincesController);
addressRouter.post("/cities", getCitiesController);

addressRouter.use(authMiddleware)

addressRouter.get("/address", getAddressController);
addressRouter.get('/:id', getAddressByIdController);
addressRouter.post("/user-address", createUserAddressController);
addressRouter.get("/delete/:addressId", deleteAddressController);
addressRouter.post("/update/:addressId", updateAddressController);

// addressRouter.get("/provinces", syncRajaOngkirProvincesController);
// addressRouter.get('/cities', syncRajaOngkirCitiesController);


export default addressRouter