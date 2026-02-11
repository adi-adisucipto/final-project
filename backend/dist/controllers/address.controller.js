"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncRajaOngkirProvincesController = syncRajaOngkirProvincesController;
exports.syncRajaOngkirCitiesController = syncRajaOngkirCitiesController;
exports.getProvincesController = getProvincesController;
exports.getCitiesController = getCitiesController;
exports.getAddressController = getAddressController;
exports.createUserAddressController = createUserAddressController;
exports.deleteAddressController = deleteAddressController;
exports.getAddressByIdController = getAddressByIdController;
exports.updateAddressController = updateAddressController;
const customError_1 = require("../utils/customError");
const address_service_1 = require("../services/address.service");
const address_validation_1 = require("../validations/address.validation");
async function syncRajaOngkirProvincesController(req, res, next) {
    try {
        const result = (0, address_service_1.syncRajaOngkirProvincesService)();
        res.json({
            result
        });
    }
    catch (error) {
        next(error);
    }
}
async function syncRajaOngkirCitiesController(req, res, next) {
    try {
        const result = (0, address_service_1.syncRajaOngkirCitiesService)();
        res.json({
            result
        });
    }
    catch (error) {
        next(error);
    }
}
async function getProvincesController(req, res, next) {
    try {
        const data = await (0, address_service_1.getProvincesServices)();
        res.json({
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function getCitiesController(req, res, next) {
    try {
        const { provinceId } = req.body;
        const data = await (0, address_service_1.getCitesServices)(provinceId);
        res.json({
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function getAddressController(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw (0, customError_1.createCustomError)(401, "Unauthorized");
        const data = await (0, address_service_1.getAddressService)(userId);
        res.status(200).json({
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function createUserAddressController(req, res, next) {
    try {
        const { firstName, lastName, provinceId, cityId, address, mainAddress } = address_validation_1.createUpdateAddressSchema.parse(req.body);
        const userId = req.user?.id;
        if (!userId)
            throw (0, customError_1.createCustomError)(401, "Unauthorized");
        const data = await (0, address_service_1.createUserAddressService)(firstName, lastName, provinceId, cityId, address, mainAddress, userId);
        res.status(201).json({
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function deleteAddressController(req, res, next) {
    try {
        const { addressId } = req.params;
        if (!addressId)
            throw new Error("Address ID is required");
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { message } = await (0, address_service_1.deleteAddressService)(addressId, userId);
        res.status(200).json({
            message: message
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
async function getAddressByIdController(req, res, next) {
    try {
        const { id } = req.params;
        const data = await (0, address_service_1.getAddressByIdService)(id);
        res.json({
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function updateAddressController(req, res, next) {
    try {
        const { addressId } = req.params;
        const { firstName, lastName, provinceId, cityId, address, mainAddress } = address_validation_1.createUpdateAddressSchema.parse(req.body);
        const userId = req.user?.id;
        if (!userId)
            throw (0, customError_1.createCustomError)(401, "Unauthorized");
        const data = await (0, address_service_1.updateAddressService)(addressId, firstName, lastName, provinceId, cityId, address, mainAddress, userId);
        res.status(200).json({
            data
        });
    }
    catch (error) {
        next(error);
    }
}
