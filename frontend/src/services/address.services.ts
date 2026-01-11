import axios from "axios";

export async function provinceService() {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/address/provinces`);

        return data;
    } catch (error) {
        throw error;
    }
}

export async function citiesService(provinceId: number) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/address/cities`, {
            provinceId
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function getAddress(userId: string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/address/address`, {userId});

        return data
    } catch (error) {
        
    }
}

export async function getAddressById(addressId: string, accessToken: string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/address/address-id`, {addressId}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data
    } catch (error) {
        
    }
}

export async function userAddress(firstName:string, lastName:string, provinceId:number, cityId:number, address:string, mainAddress:boolean, accessToken:string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/address/user-address`, {
            firstName,
            lastName,
            provinceId,
            cityId,
            address,
            mainAddress,
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

export async function deleteAddress(addressId: string, accessToken: string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/address/delete-address`, {
            addressId
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

export async function updateAddres(addressId: string, firstName:string, lastName:string, provinceId:number, cityId:number, address:string, mainAddress:boolean, accessToken: string) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/address/update-address`, {
            addressId, firstName, lastName, provinceId, cityId, address, mainAddress
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