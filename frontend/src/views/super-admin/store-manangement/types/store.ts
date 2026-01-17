export interface StoreProps {
    id: string,
    name: string,
    address: string,
    admins: { user: {
        first_name: string;
        last_name: string;
        avatar: string;
        email: string
    } } | null,
    isActive: boolean,
    cityId: number;
    provinceId: number;
    latitude: number;
    longitude: number;
    postalCode: string
}

export interface StoreCardProps {
    store: StoreProps;
    index: number;
    onDelete: (id:string) => void;
    onEditStore?: (store: StoreProps) => void;
    onAssignAdmin?: (store: StoreProps) => void;
}

export interface StoreAdmin {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar:string
}