import axios from "axios";

export async function requestChangeEmail(accessToken:string, newEmail:string, password:string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/change-email/request-change-email`,{
            newEmail, password
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data
    } catch (error) {
        throw error;
    }
}

export async function changeEmail(token:string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/change-email/change-email`, {token});
        return data
    } catch (error) {
        throw error;
    }
}