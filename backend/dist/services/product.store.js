"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapStoreSummary = exports.getStoreOrFail = exports.getStoreByIdOrFail = exports.getCoords = void 0;
const prisma_1 = require("../lib/prisma");
const customError_1 = require("../utils/customError");
const geo_1 = require("../utils/geo");
const getActiveStores = async () => prisma_1.prisma.store.findMany({
    where: { isActive: true },
    select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        cityId: true,
        provinceId: true,
        createdAt: true,
    },
});
const getDistance = (coords, store) => (0, geo_1.calculateDistanceKm)(coords, {
    lat: store.latitude,
    lng: store.longitude,
});
const getMainStore = (stores) => {
    let mainStore = stores[0];
    for (const store of stores) {
        if (store.createdAt < mainStore.createdAt) {
            mainStore = store;
        }
    }
    return mainStore;
};
const getNearestStore = (stores, coords) => {
    let nearestStore = stores[0];
    let nearestDistance = getDistance(coords, nearestStore);
    for (const store of stores) {
        const distance = getDistance(coords, store);
        if (distance < nearestDistance) {
            nearestStore = store;
            nearestDistance = distance;
        }
    }
    return nearestStore;
};
const pickStore = async (coords) => {
    const stores = await getActiveStores();
    if (stores.length === 0)
        return null;
    if (coords)
        return getNearestStore(stores, coords) || getMainStore(stores);
    return getMainStore(stores);
};
const getStoreById = (storeId) => prisma_1.prisma.store.findFirst({
    where: { id: storeId, isActive: true },
    select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        cityId: true,
        provinceId: true,
        createdAt: true,
    },
});
const getCoords = (params) => params.lat !== undefined && params.lng !== undefined
    ? { lat: params.lat, lng: params.lng }
    : undefined;
exports.getCoords = getCoords;
const getStoreByIdOrFail = async (storeId) => {
    const store = await getStoreById(storeId);
    if (!store)
        throw (0, customError_1.createCustomError)(404, "Store not found");
    return store;
};
exports.getStoreByIdOrFail = getStoreByIdOrFail;
const getStoreOrFail = async (coords) => {
    const store = await pickStore(coords);
    if (!store)
        throw (0, customError_1.createCustomError)(404, "Store not found");
    return store;
};
exports.getStoreOrFail = getStoreOrFail;
const mapStoreSummary = (store) => ({
    id: store.id,
    name: store.name,
    address: store.address,
    cityId: store.cityId,
    provinceId: store.provinceId,
});
exports.mapStoreSummary = mapStoreSummary;
