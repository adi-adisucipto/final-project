import axios from "axios";

export async function provinceService() {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/address/provinces`);

        return data;
    } catch (error) {
        throw error
    }
}

export async function citiesService(provinceId: number) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/address/cities`, {
            provinceId
        });

        return data;
    } catch (error) {
        
    }
}