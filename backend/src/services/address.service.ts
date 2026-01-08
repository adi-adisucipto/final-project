import { RAJAONGKIR_KEY } from "../configs/env.config";
import { prisma } from "../lib/prisma";
import axios from "axios";
import { createCustomError } from "../utils/customError";
import { getCoordinates } from "../lib/getLatiLng";
import { Prisma } from "../generated/prisma/client";

export async function syncRajaOngkirProvincesService() {
    try {
        const provinceRes = await axios.get('https://rajaongkir.komerce.id/api/v1/destination/province', {
            headers: {"key": RAJAONGKIR_KEY}
        });

        const provinces = provinceRes.data.data

        for(const p of provinces) {
            await prisma.province.create({
                data: {
                    id: parseInt(p.id),
                    province_name: p.name
                }
            })
        }
    } catch (error) {
        throw error
    }
}

export async function syncRajaOngkirCitiesService() {
    try {
        const url = `https://rajaongkir.komerce.id/api/v1/destination/city/9`;

        const cities = await axios.get(url, {
            headers: {"key": RAJAONGKIR_KEY}
        });

        const citiesData = cities.data.data.map((city: any) => ({
            id: Number(city.id),
            provinceId: 5,
            city_name: city.name,
            type: "Kabupaten/Kota",
        }));

        await prisma.city.createMany({
            data: citiesData,
            skipDuplicates: true,
        });

    } catch (error) {
        throw error;
    }
}

export async function getProvincesServices() {
    try {
        const data = await prisma.province.findMany();

        return data;
    } catch (error) {
        throw error;
    }
}

export async function getCitesServices(provinceId: number) {
    try {
        const data = await prisma.city.findMany({
            where: {provinceId: provinceId}
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function userAddressService(firstName:string, lastName:string, provinceId:number, cityId:number, address:string, mainAddress:boolean, userId:string) {
    try {
        const addressUser = await prisma.userAddress.findMany({
            where: {address: address}
        });
        if(addressUser) throw createCustomError(200, "Alamat sudah ada!");
        
        const cityName = await prisma.city.findUnique({
            where: {id: cityId}
        });
        if(!cityName) throw createCustomError(404, "Kota tidak ditemukan");

        const provinceName = await prisma.province.findUnique({
            where: {id: provinceId}
        });
        if(!provinceName) throw createCustomError(404, "Provinsi tidak ditemukan");

        const isFirstAddress = await prisma.userAddress.findMany({
            where: {user_id: userId}
        });
        if(isFirstAddress.length === 0) mainAddress = true

        const fullAddress = `${address}, ${cityName.city_name}, ${provinceName.province_name}, Indonesia`;
        let coordinates = await getCoordinates(fullAddress);

        if(!coordinates) throw createCustomError(404, "Koordinat tidak ditemukan")

        await prisma.$transaction(async (tx:Prisma.TransactionClient) => {
            if(mainAddress) {
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
        }
    } catch (error) {
        throw error;
    }
}