import axios from "axios";

export async function updateUser(formData: FormData) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`, formData);

        return data
    } catch (error) {
        
    }
}