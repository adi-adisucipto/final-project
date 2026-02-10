import { calculateDistance } from "../helpers/distance";
import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";

export async function nearStoreService(userLat: number, userLng: number) {
    try {
        const store = await prisma.store.findMany({
            where: {
                isActive: true
            },
            select: {
                id: true,
                name: true,
                latitude: true,
                longitude: true
            }
        })
        const storeDistance = store.map((store) => {
            const distance = calculateDistance(userLat, userLng, Number(store.latitude), Number(store.longitude));

            return { ...store, distance }
        });

        storeDistance.sort((a, b) => a.distance - b.distance);

        const nearStores = storeDistance.filter(store => store.distance <= 10).slice(0,5);

        return nearStores;
    } catch (error) {
        throw error;
    }
}

export async function mainStoreService(storeId:string) {
    if(!storeId) throw createCustomError(404, "Store not found");
    const store = await prisma.store.findUnique({
        where: {id: storeId}
    });

    return store;
}

export async function productByStoreService(storeId:string) {
    if(!storeId) throw createCustomError(404, "Store not found");
    const products = await prisma.store.findUnique({
        where: { id: storeId },
        include: {products: true}
    });

    return products
}