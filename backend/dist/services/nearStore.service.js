"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearStoreService = nearStoreService;
exports.mainStoreService = mainStoreService;
exports.productByStoreService = productByStoreService;
const distance_1 = require("../helpers/distance");
const prisma_1 = require("../lib/prisma");
const customError_1 = require("../utils/customError");
async function nearStoreService(userLat, userLng) {
    try {
        const store = await prisma_1.prisma.store.findMany({
            where: {
                isActive: true
            },
            select: {
                id: true,
                name: true,
                latitude: true,
                longitude: true
            }
        });
        const storeDistance = store.map((store) => {
            const distance = (0, distance_1.calculateDistance)(userLat, userLng, Number(store.latitude), Number(store.longitude));
            return { ...store, distance };
        });
        storeDistance.sort((a, b) => a.distance - b.distance);
        const nearStores = storeDistance.filter(store => store.distance <= 10).slice(0, 5);
        return nearStores;
    }
    catch (error) {
        throw error;
    }
}
async function mainStoreService(storeId) {
    if (!storeId)
        throw (0, customError_1.createCustomError)(404, "Store not found");
    const store = await prisma_1.prisma.store.findUnique({
        where: { id: storeId }
    });
    return store;
}
async function productByStoreService(storeId) {
    if (!storeId)
        throw (0, customError_1.createCustomError)(404, "Store not found");
    const products = await prisma_1.prisma.store.findUnique({
        where: { id: storeId },
        include: { products: true }
    });
    return products;
}
