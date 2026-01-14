import { getCoordinates } from "../lib/getLatiLng";
import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";

export async function createStoreService(
    name:string,
    isActive:boolean,
    address:string,
    latitude:number,
    longitude:number,
    cityId:number,
    provinceId:number,
    postalCode:string
) {
    try {
        if(latitude == 0 && longitude == 0) {
            const fullAddress = `${address}, Indonesia`;
            let coordinates = await getCoordinates(fullAddress);
            latitude = coordinates?.latitude;
            longitude = coordinates?.longitude;
        }
        const data = await prisma.store.create({
            data: {
                name: name,
                isActive: isActive,
                address: address,
                latitude: latitude,
                longitude: longitude,
                cityId: cityId,
                provinceId: provinceId,
                postalCode: postalCode
            }
        });

        return data
    } catch (error) {
        throw error;
    }
}

export async function getStoreService() {
    try {
        const data = prisma.store.findMany({
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

        return data
    } catch (error) {
        throw error
    }
}

export async function deleteStoreService(storeId: string) {
    try {
        await prisma.store.delete({
            where: {id: storeId}
        });
    } catch (error) {
        throw error;
    }
}

export async function updateStoreService(
    storeId:string,
    name:string,
    isActive:boolean,
    address:string,
    latitude:number,
    longitude:number,
    cityId:number,
    provinceId:number,
    postalCode:string
) {
    try {
        const fullAddress = `${address}, Indonesia`;
        let coordinates = await getCoordinates(fullAddress);
        if(!coordinates) throw createCustomError(404, "Coordinates not found");

        await prisma.store.update({
            where: {id: storeId},
            data: {
                name: name,
                isActive: isActive,
                address: address,
                latitude: latitude,
                longitude: longitude,
                cityId: cityId,
                provinceId: provinceId,
                postalCode: postalCode
            }
        });
    } catch (error) {
        throw error;
    }
}