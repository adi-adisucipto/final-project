import axios from "axios";

export async function createStore(
    name:string,
    isActive:boolean,
    address:string,
    latitude:number,
    longitude:number,
    cityId:number,
    provinceId:number,
    postalCode:string,
    accessToken:string
) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/store/store-address`, {
            name,
            isActive,
            address,
            latitude,
            longitude,
            cityId,
            provinceId,
            postalCode
        },{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data
    } catch (error) {
        throw error;
    }
}

export async function getStore(accessToken: string) {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/store/stores`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return data
    } catch (error) {
        throw error;
    }
}

export async function deleteStore(storeId:string, accessToken:string) {
    try {
        const data = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/store/delete`, {storeId}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data
    } catch (error) {
        throw error;
    }
}

export async function updateStore(
    storeId:string,
    name:string,
    isActive:boolean,
    address:string,
    latitude:number,
    longitude:number,
    cityId:number,
    provinceId:number,
    postalCode:string,
    accessToken:string
) {
    try {
        const data = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/store/update`, {
            storeId,
            name,
            isActive,
            address,
            latitude,
            longitude,
            cityId,
            provinceId,
            postalCode,
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

export async function getAdmins() {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/store/admins`);

        return data;
    } catch (error) {
        throw error;
    }
}

export async function assignAdmin(userId: string, storeId: string, accessToken: string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/store/assign-admin`, {
            userId, storeId
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function activateStore(storeId: string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/store/activate-store`, {
            storeId
        })

        return data
    } catch (error) {
        throw error;
    }
}