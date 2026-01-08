import axios from "axios";
import { API_KEY_OPENCAGE } from "../configs/env.config";

export async function getCoordinates(address: string) {
    try {
        const API_KEY = API_KEY_OPENCAGE
        const { data } = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
                q: address,
                key: API_KEY,
                limit: 1,
                countrycode: 'id'
            },
        });

        if(data.results && data.results.length > 0){
            const result = data.results[0];
            const { lat, lng } = result.geometry;
            const formattedAddress = result.formatted;
            const postalCode = result.components.postcode || null;

            return {
                latitude: lat,
                longitude: lng,
                address: formattedAddress,
                postalCode: postalCode
            }
        }

        return null;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios Error:', error.message);
        } else {
            console.error('Unexpected Error:', error);
        }
        throw error;
    }
}