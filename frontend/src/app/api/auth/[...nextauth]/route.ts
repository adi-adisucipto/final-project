import { login } from "@/services/auth.service";
import { DecodedToken } from "@/types/auth";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

async function refreshAccessToken(token:JWT) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            refreshToken: token.refreshToken
        });

        const { accessToken, refreshToken } = data;
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
            error: null
        }
    } catch (error) {
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
        strategy: "jwt"
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
                    const tokens = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,{
                        email: credentials.email,
                        password: credentials.password
                    });
                    const {accessToken, refreshToken} = tokens.data;
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
                        refreshToken: refreshToken
                    }
                } catch (error) {
                    if(error instanceof AxiosError) {
                        console.log(error.response?.data)
                    }
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if(user) {
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
                    error: null
                }
            }

            if(!token.accessToken) return { ...token, error: "InvalidAccessToken" };
            
            let decoded: DecodedToken;
            try {
                decoded = jwtDecode<DecodedToken>(token.accessToken as string);
            } catch (error) {
                return {...token, error: "InvalidAccessToken"}
            }
            
            const isExipired = decoded.exp * 1000 < Date.now();
            if(!isExipired) return token;
            return await refreshAccessToken(token);
        },
        async session({session, token}) {
            if(!token || token.error) {
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
                    exp: token.exp
                },
                accessToken: token.accessToken,
                error: null
            }
        }
    }
});

export { handler as GET, handler as POST }