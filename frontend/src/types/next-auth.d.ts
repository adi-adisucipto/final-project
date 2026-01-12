import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User extends DefaultUser {
        id: string;
        email: string;
        is_verified: boolean;
        role: string;
        referral_code: string;
        first_name: string | null;
        last_name: string | null;
        avatar: string | null;
        exp: number;
        accessToken: string;
        refreshToken: string;
        isStoreAdmin?: boolean;
        storeAdminId?: string | null;
        storeId?: string | null;
        storeName?: string | null;
    }

    interface Session extends DefaultSession {
        user: User | null;
        accessToken: string | null;
        error: string | null;
    }

    type AdapterUser = User;
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        email: string;
        is_verified: boolean;
        role: string;
        referral_code: string;
        first_name: string | null;
        last_name: string | null;
        avatar: string | null;
        exp: number;
        accessToken: string;
        refreshToken: string;
        error: string | null;
        isStoreAdmin?: boolean;
        storeAdminId?: string | null;
        storeId?: string | null;
        storeName?: string | null;
    }
}