import { Role } from "../generated/prisma/enums"

export interface UserProps {
    id: string,
    email: string | null,
    is_verified: boolean,
    is_active: boolean,
    role: Role,
    referral_code: string,
    first_name: string,
    last_name: string,
    avatar: string,
    password: string
    storeAdmin: {
        id: string | null,
        storeId: string | null,
        store: {
            name: string | null
        }
    }
}
