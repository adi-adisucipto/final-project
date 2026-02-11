"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoreService = createStoreService;
exports.getStoreService = getStoreService;
exports.deleteStoreService = deleteStoreService;
exports.updateStoreService = updateStoreService;
exports.getAdminsService = getAdminsService;
exports.assignAdminService = assignAdminService;
exports.activateStoreService = activateStoreService;
const getLatiLng_1 = require("../lib/getLatiLng");
const prisma_1 = require("../lib/prisma");
const customError_1 = require("../utils/customError");
async function createStoreService(name, isActive, address, latitude, longitude, cityId, provinceId, postalCode) {
    try {
        let coordinates;
        let finalLat = latitude;
        let finalLong = longitude;
        if (latitude === 0 && longitude === 0) {
            const fullAddress = `${address}, Indonesia`;
            coordinates = await (0, getLatiLng_1.getCoordinates)(fullAddress);
            console.log(coordinates);
            finalLat = coordinates?.latitude;
            finalLong = coordinates?.longitude;
        }
        const data = await prisma_1.prisma.store.create({
            data: {
                name: name,
                isActive: isActive,
                address: address,
                latitude: latitude === 0 ? finalLat : latitude,
                longitude: longitude === 0 ? finalLong : longitude,
                cityId: cityId,
                provinceId: provinceId,
                postalCode: postalCode
            }
        });
        return data;
    }
    catch (error) {
        throw error;
    }
}
async function getStoreService() {
    try {
        const data = prisma_1.prisma.store.findMany({
            include: {
                admins: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                avatar: true,
                                first_name: true,
                                last_name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return data;
    }
    catch (error) {
        throw error;
    }
}
async function deleteStoreService(storeId) {
    try {
        await prisma_1.prisma.$transaction(async (tx) => {
            await prisma_1.prisma.storeAdmin.deleteMany({
                where: { storeId: storeId },
            });
            await tx.store.update({
                where: { id: storeId },
                data: { isActive: false }
            });
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
async function updateStoreService(storeId, name, isActive, address, latitude, longitude, cityId, provinceId, postalCode) {
    try {
        const fullAddress = `${address}, Indonesia`;
        let coordinates = await (0, getLatiLng_1.getCoordinates)(fullAddress);
        if (!coordinates)
            throw (0, customError_1.createCustomError)(404, "Coordinates not found");
        console.log(coordinates);
        await prisma_1.prisma.store.update({
            where: { id: storeId },
            data: {
                name: name,
                isActive: isActive,
                address: address,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                cityId: cityId,
                provinceId: provinceId,
                postalCode: postalCode
            }
        });
    }
    catch (error) {
        throw error;
    }
}
async function getAdminsService() {
    try {
        return await prisma_1.prisma.user.findMany({
            where: { role: "admin", storeAdmin: null }
        });
    }
    catch (error) {
        throw error;
    }
}
async function assignAdminService(userId, storeId) {
    try {
        const data = await prisma_1.prisma.storeAdmin.create({
            data: {
                userId: userId,
                storeId: storeId
            }
        });
        return data;
    }
    catch (error) {
        throw error;
    }
}
async function activateStoreService(storeId) {
    try {
        return await prisma_1.prisma.store.update({
            where: { id: storeId },
            data: { isActive: true }
        });
    }
    catch (error) {
        throw error;
    }
}
