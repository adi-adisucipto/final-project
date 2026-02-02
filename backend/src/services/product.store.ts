import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";
import { calculateDistanceKm, Coordinates } from "../utils/geo";

export type StoreSummary = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cityId: number;
  provinceId: number;
  createdAt: Date;
};

const getActiveStores = async () =>
  prisma.store.findMany({
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

const getDistance = (coords: Coordinates, store: StoreSummary) =>
  calculateDistanceKm(coords, {
    lat: store.latitude,
    lng: store.longitude,
  });

const getMainStore = (stores: StoreSummary[]) => {

  let mainStore = stores[0];
  for (const store of stores) {
    if (store.createdAt < mainStore.createdAt) {
      mainStore = store;
    }
  }
  return mainStore;
};

const getNearestStore = (stores: StoreSummary[], coords: Coordinates) => {
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

const pickStore = async (coords?: Coordinates) => {
  const stores = await getActiveStores();
  if (stores.length === 0) return null;
  if (coords) return getNearestStore(stores, coords) || getMainStore(stores);
  return getMainStore(stores);
};

const getStoreById = (storeId: string) =>
  prisma.store.findFirst({
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

export const getCoords = (params: { lat?: number; lng?: number }) =>
  params.lat !== undefined && params.lng !== undefined
    ? { lat: params.lat, lng: params.lng }
    : undefined;

export const getStoreByIdOrFail = async (storeId: string) => {
  const store = await getStoreById(storeId);
  if (!store) throw createCustomError(404, "Store not found");
  return store;
};

export const getStoreOrFail = async (coords?: Coordinates) => {
  const store = await pickStore(coords);
  if (!store) throw createCustomError(404, "Store not found");
  return store;
};

export const mapStoreSummary = (store: StoreSummary) => ({
  id: store.id,
  name: store.name,
  address: store.address,
  cityId: store.cityId,
  provinceId: store.provinceId,
});
