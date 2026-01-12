import { googleLogin, login } from "@/services/auth.service";
import { DecodedToken } from "@/types/auth";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

async function refreshAccessToken(token:JWT) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            refreshToken: token.refreshToken
        });

        const { accessToken, refreshToken } = data;
        const decode = jwtDecode<DecodedToken>(accessToken);

        console.log("berhasil")

        return {
            ...token,
            id: decode.id,
            email: decode.email,
            is_verified: decode.is_verified,
            role: decode.role,
            referral_code: decode.referral_code,
            first_name: decode.first_name,
            last_name: decode.last_name,
            avatar: decode.avatar,
            exp: decode.exp,
            accessToken: accessToken,
            refreshToken: refreshToken,
            isStoreAdmin: decode.isStoreAdmin,
            storeAdminId: decode.storeAdminId,
            storeId: decode.storeId,
            storeName: decode.storeName,
            error: null
        }
    } catch (error) {
        console.log(error);
        return {
            ...token,
            error: "RefreshTokenError"
        }
    }
}

const handler = NextAuth({
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [
        Credentials({
            credentials: {
                email: {label: "email", type: "email", required: true},
                password: {label: "password", type: "password", required: true}
            },
            async authorize(credentials) {
                try {
                    if(!credentials?.email) throw new Error("email not found");
                    const tokens = await login(credentials.email, credentials.password)
                    const {accessToken, refreshToken} = tokens;
                    if(!accessToken) throw new Error("InvalidAccessToken");

                    const decode = jwtDecode<DecodedToken>(accessToken);

                    return {
                        id: decode.id,
                        email: decode.email,
                        is_verified: decode.is_verified,
                        role: decode.role,
                        referral_code: decode.referral_code,
                        first_name: decode.first_name,
                        last_name: decode.last_name,
                        avatar: decode.avatar,
                        exp: decode.exp,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        isStoreAdmin: decode.isStoreAdmin,
                        storeAdminId: decode.storeAdminId,
                        storeId: decode.storeId,
                        storeName: decode.storeName
                    }
                } catch (error) {
                    if(error instanceof AxiosError) {
                        console.log(error.response?.data)
                    }
                    return null
                }
            }
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "online",
                    response_type: "code"
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user, account, trigger, session}) {
            if(user && account?.provider == "credentials") {
                return {
                    ...token,
                    id: user.id,
                    email: user.email,
                    is_verified: user.is_verified,
                    role: user.role,
                    referral_code: user.referral_code,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    avatar: user.avatar,
                    exp: user.exp,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    isStoreAdmin: user.isStoreAdmin,
                    storeAdminId: user.storeAdminId,
                    storeId: user.storeId,
                    storeName: user.storeName,
                    error: null
                }
            }

            if(account?.provider == 'google' && account.id_token) {
                try {
                    const tokens = await googleLogin(account.id_token);
                    const {accessToken, refreshToken} = tokens;
                    const decode = jwtDecode<DecodedToken>(accessToken);

                    return {
                        ...token,
                        id: decode.id,
                        email: decode.email,
                        is_verified: decode.is_verified,
                        role: decode.role,
                        referral_code: decode.referral_code,
                        first_name: decode.first_name,
                        last_name: decode.last_name,
                        avatar: decode.avatar,
                        exp: decode.exp,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        isStoreAdmin: decode.isStoreAdmin,
                        storeAdminId: decode.storeAdminId,
                        storeId: decode.storeId,
                        storeName: decode.storeName,
                        error: null
                    }
                } catch (error) {
                    return {...token, error: "InvalidAccessToken"}
                }
            }

            if (trigger === "update" && session) {
                token.avatar = session.user.avatar;
                token.avatar_id = session.user.avatar_id;
                token.first_name = session.user.first_name;
                token.last_name = session.user.last_name;
            }

            if (token?.accessToken) {
                const isExpired = (token.exp as number) * (1000 - 30000) < Date.now();
                if (!isExpired) return token;
                
                console.log("Token expired, refreshing...");
                return await refreshAccessToken(token);
            }
            
            return token;
        },
        async session({session, token}) {
            if(token?.error === "RefreshTokenError" || token.error === "InvalidAccessToken") {
                return {
                    ...session,
                    user: null,
                    accessToken: null,
                    error: token.error
                }
            }

            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    email: token.email,
                    is_verified: token.is_verified,
                    role: token.role,
                    referral_code: token.referral_code,
                    first_name: token.first_name,
                    last_name: token.last_name,
                    avatar: token.avatar,
                    exp: token.exp,
                    isStoreAdmin: token.isStoreAdmin,
                    storeAdminId: token.storeAdminId,
                    storeId: token.storeId,
                    storeName: token.storeName
                },
                accessToken: token.accessToken,
                error: null
            }
        }
    }
});

export { handler as GET, handler as POST }