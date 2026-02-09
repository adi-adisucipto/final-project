"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncRajaOngkirProvincesService = syncRajaOngkirProvincesService;
exports.syncRajaOngkirCitiesService = syncRajaOngkirCitiesService;
exports.getProvincesServices = getProvincesServices;
exports.getCitesServices = getCitesServices;
exports.getAddressService = getAddressService;
exports.getAddressByIdService = getAddressByIdService;
exports.userAddressService = userAddressService;
exports.deleteAddressService = deleteAddressService;
exports.updateAddressService = updateAddressService;
const env_config_1 = require("../configs/env.config");
const prisma_1 = require("../lib/prisma");
const axios_1 = __importDefault(require("axios"));
const customError_1 = require("../utils/customError");
const getLatiLng_1 = require("../lib/getLatiLng");
async function syncRajaOngkirProvincesService() {
    try {
        const provinceRes = await axios_1.default.get('https://rajaongkir.komerce.id/api/v1/destination/province', {
            headers: { "key": env_config_1.RAJAONGKIR_KEY }
        });
        const provinces = provinceRes.data.data;
        for (const p of provinces) {
            await prisma_1.prisma.province.create({
                data: {
                    id: parseInt(p.id),
                    province_name: p.name
                }
            });
        }
    }
    catch (error) {
        throw error;
    }
}
async function syncRajaOngkirCitiesService() {
    try {
        const url = `https://rajaongkir.komerce.id/api/v1/destination/city/9`;
        const cities = await axios_1.default.get(url, {
            headers: { "key": env_config_1.RAJAONGKIR_KEY }
        });
        const citiesData = cities.data.data.map((city) => ({
            id: Number(city.id),
            provinceId: 5,
            city_name: city.name,
            type: "Kabupaten/Kota",
        }));
        await prisma_1.prisma.city.createMany({
            data: citiesData,
            skipDuplicates: true,
        });
    }
    catch (error) {
        throw error;
    }
}
async function getProvincesServices() {
    try {
        const data = await prisma_1.prisma.province.findMany();
        return data;
    }
    catch (error) {
        throw error;
    }
}
async function getCitesServices(provinceId) {
    try {
        const data = await prisma_1.prisma.city.findMany({
            where: { provinceId: provinceId }
        });
        return data;
    }
    catch (error) {
        throw error;
    }
}
async function getAddressService(userId) {
    try {
        const addressUser = await prisma_1.prisma.userAddress.findMany({
            where: { user_id: userId }
        });
        return addressUser;
    }
    catch (error) {
        throw error;
    }
}
async function getAddressByIdService(addressId) {
    try {
        const data = await prisma_1.prisma.userAddress.findUnique({
            where: { id: addressId },
            include: {
                userCity: true,
                provinceId: true
            }
        });
        return data;
    }
    catch (error) {
        throw error;
    }
}
async function userAddressService(firstName, lastName, provinceId, cityId, address, mainAddress, userId) {
    try {
        const cityName = await prisma_1.prisma.city.findUnique({
            where: { id: cityId }
        });
        if (!cityName)
            throw (0, customError_1.createCustomError)(404, "Kota tidak ditemukan");
        const provinceName = await prisma_1.prisma.province.findUnique({
            where: { id: provinceId }
        });
        if (!provinceName)
            throw (0, customError_1.createCustomError)(404, "Provinsi tidak ditemukan");
        const isFirstAddress = await getAddressService(userId);
        if (isFirstAddress.length === 0)
            mainAddress = true;
        const fullAddress = `${address}, Indonesia`;
        let coordinates = await (0, getLatiLng_1.getCoordinates)(fullAddress);
        if (!coordinates)
            throw (0, customError_1.createCustomError)(404, "Koordinat tidak ditemukan");
        await prisma_1.prisma.$transaction(async (tx) => {
            if (mainAddress) {
                await tx.userAddress.updateMany({
                    where: {
                        user_id: userId,
                        is_main_address: true
                    },
                    data: {
                        is_main_address: false
                    }
                });
            }
            await tx.userAddress.create({
                data: {
                    user_id: userId,
                    first_name: firstName,
                    last_name: lastName,
                    address: address,
                    province: provinceId,
                    city: cityId,
                    postal_code: coordinates.postalCode,
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                    is_main_address: mainAddress,
                    updated_at: new Date()
                }
            });
        });
        return {
            firstName,
            lastName,
            provinceName: provinceName.province_name,
            cityName: cityName.city_name,
            address
        };
    }
    catch (error) {
        throw error;
    }
}
async function deleteAddressService(addressId, userId) {
    try {
        const mainAddress = await getAddressByIdService(addressId);
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.userAddress.delete({
                where: { id: addressId }
            });
            if (mainAddress?.is_main_address) {
                const address = await getAddressService(userId);
                if (address.length > 0) {
                    const randomIndex = Math.floor(Math.random() * address.length);
                    const newMainAddress = address[randomIndex];
                    await tx.userAddress.update({
                        where: { id: newMainAddress.id },
                        data: {
                            is_main_address: true
                        }
                    });
                }
            }
        });
        return {
            message: "Alamat berhasil dihapus"
        };
    }
    catch (error) {
        throw error;
    }
}
async function updateAddressService(addressId, firstName, lastName, provinceId, cityId, address, mainAddress) {
    try {
        const userAddress = await prisma_1.prisma.userAddress.findUnique({
            where: { id: addressId },
        });
        if (!userAddress)
            throw (0, customError_1.createCustomError)(404, "Address not found!");
        const cityName = await prisma_1.prisma.city.findUnique({
            where: { id: cityId }
        });
        if (!cityName)
            throw (0, customError_1.createCustomError)(404, "City not found");
        const provinceName = await prisma_1.prisma.province.findUnique({
            where: { id: provinceId }
        });
        if (!provinceName)
            throw (0, customError_1.createCustomError)(404, "Province not found");
        const fullAddress = `${address}, ${cityName.city_name}, ${provinceName.province_name}, Indonesia`;
        let coordinates = await (0, getLatiLng_1.getCoordinates)(fullAddress);
        if (!coordinates)
            throw (0, customError_1.createCustomError)(404, "Coordinates not found");
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.userAddress.update({
                where: { id: addressId },
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    address: address,
                    province: provinceId,
                    city: cityId,
                    postal_code: coordinates.postalCode,
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                    is_main_address: mainAddress,
                    updated_at: new Date()
                }
            });
        });
    }
    catch (error) {
        throw error;
    }
}
