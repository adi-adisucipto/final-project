import axios from "axios";

export async function provinceService() {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/address/provinces`);

        return data;
    } catch (error) {
        throw error;
    }
}

export async function citiesService(provinceId: number) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/address/cities`, {
            provinceId
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function userAddress(firstName:string, lastName:string, provinceId:number, cityId:number, address:string, mainAddress:boolean, userId:string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/address/user-address`, {
            firstName,
            lastName,
            provinceId,
            cityId,
            address,
            mainAddress,
            userId
        });

        return data
    } catch (error) {
        throw error;
    }
}