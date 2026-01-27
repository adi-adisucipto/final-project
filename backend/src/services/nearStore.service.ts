import { calculateDistance } from "../helpers/distance";
import { prisma } from "../lib/prisma";

export async function nearStoreService(userLat: number, userLng: number) {
    try {
        const store = await prisma.store.findMany({
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