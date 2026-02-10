import axios from "axios";

export async function nearStore(userLat: number, userLng: number) {
    try {
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/stores/near-store`, {userLat, userLng});

        return data.nearStores;
    } catch (error) {
        throw error
    }
}

export async function mainStore() {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stores/main-store/fe4cd292-83f8-472c-b07a-e81a6d6c1c45`);

        return data
    } catch (error) {
        throw error
    }
}

export async function productsByStore(storeId:string) {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stores/products/${storeId}`);

        return data;
    } catch (error) {
        throw error;
    }
}