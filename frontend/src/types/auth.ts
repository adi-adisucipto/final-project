export interface DecodedToken {
    id: string;
    email: string;
    is_verified: boolean;
    role: string;
    referral_code: string;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
    exp: number;
}