import axios from "axios";

export async function updateUser(formData: FormData, accessToken:string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`, formData,{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data
    } catch (error) {
        throw error;
    }
}

export async function sendEmailChangePassword(email:string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/change-password`, {
            email: email
        });

        return data
    } catch (error) {
        
    }
}