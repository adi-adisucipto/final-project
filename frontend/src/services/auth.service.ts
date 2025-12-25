import axios from "axios";

export async function registrationService(email:string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/registration`, {email: email});

        return data
    } catch (error) {
        throw error
    }
}