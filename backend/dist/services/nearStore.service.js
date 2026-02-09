"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearStoreService = nearStoreService;
const distance_1 = require("../helpers/distance");
const prisma_1 = require("../lib/prisma");
async function nearStoreService(userLat, userLng) {
    try {
        const store = await prisma_1.prisma.store.findMany({
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
