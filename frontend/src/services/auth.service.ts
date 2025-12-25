import axios from "axios";

export async function registrationService(email:string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/registration`, {email: email});

        return data
    } catch (error) {
        throw error
    }
}

export async function verificationService(password:string, firstName:string, lastName:string, refCode:string, token:string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verification`, {
            password, firstName, lastName, refCode
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return data;
    } catch (error) {
        throw error
    }
}