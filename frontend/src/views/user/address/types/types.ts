export interface SubmitProps {
    firstName: string;
    lastName: string;
    provinceId: number;
    cityId: number;
    address: string;
    mainAddress: boolean
}

export interface ProvinceItem {
    id: number;
    province_name: string
}

export interface CitiesItem {
    id: number;
    provinceId: number;
    city_name: string;
}