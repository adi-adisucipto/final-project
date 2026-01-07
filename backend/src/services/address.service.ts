import { RAJAONGKIR_KEY } from "../configs/env.config";
import { prisma } from "../lib/prisma";
import axios from "axios";

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