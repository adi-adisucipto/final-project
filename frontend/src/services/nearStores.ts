import axios from "axios";

export async function nearStore(userLat: number, userLng: number) {
    try {
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/stores/near-store`, {userLat, userLng});

        return data.nearStores;
    } catch (error) {
        throw error
    }
}