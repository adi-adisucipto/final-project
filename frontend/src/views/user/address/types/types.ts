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

export interface AddressProps {
  id: string,
  first_name: string,
  last_name: string,
  province: number,
  city: number,
  address: string,
  is_main_address: boolean,
  provinceId: {id: number, province_name:string},
  userCity: {id: number, city_name:string}
}