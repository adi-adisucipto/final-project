import { sign } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";
import { SECRET_KEY_ACCESS, SECRET_KEY_REFRESH, SECRET_KEY_REGIS } from "../configs/env.config";
import { Prisma } from "../generated/prisma/browser";
import { compileRegistrationTemplate } from "../helpers/compileTemplates";
import { transporter } from "../helpers/transporter";
import { referralCodeGenerator } from "../helpers/referralCode";
import { compare, compareSync, hash } from "bcrypt";
import { UserProps } from "../types/auth.type";

export async function checkEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: { email: email },
        include: {
            storeAdmin: {
                include: {
                    store: {
                        select: {
                            id: true,
                            name: true,
                            isActive: true
                        }
                    }
                }
            }
        }
    });

    return user
}

export async function createRegisTokenService(email: string) {
    const isExist = await checkEmail(email);
    if (isExist !== null) {
        throw createCustomError(409, "User already exist, please login!");
    }

    const payload = { email: email }
    const token = sign(payload, SECRET_KEY_REGIS, { expiresIn: "1h" });
    const exp = new Date();
    exp.setHours(exp.getHours() + 1);

    await prisma.token.create({
        data: {
            token: token,
            expires_at: exp
        }
    });

    try {
        const html = await compileRegistrationTemplate(token);

        await transporter.sendMail({
            to: email,
            subject: "Registration",
            html
        });
    } catch (error) {
        await prisma.token.delete({
            where: { token: token }
        })
        throw new Error("Failed to send registration email. Please try again.");
    }
}

export async function checkRefCode(refCode: string) {
    const user = await prisma.user.findUnique({
        where: { referral_code: refCode }
    });

    return user;
};

export async function createUserService(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    refCode: string | null,
    token: string
) {
    try {
        let isTaken = true;
        let referralCode = "";

        while (isTaken) {
            referralCode = referralCodeGenerator()
            const existingUser = await prisma.user.findUnique({
                where: { referral_code: referralCode }
            });
            if (!existingUser) isTaken = false;
        }

        const validToken = await prisma.token.findFirst({
            where: {
                token: token,
                expires_at: { gt: new Date() }
            }
        });
        if (!validToken) {
            throw createCustomError(400, "Invalid or expired token");
        }

        const hashedPassword = await hash(password, 10);

        const user = await checkEmail(email);

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            let userIdForReward = null;
            if (!user) {
                const newUser = await tx.user.create({
                    data: {
                        email: email,
                        is_verified: true,
                        referral_code: referralCode,
                        password: hashedPassword,
                        first_name: firstName,
                        last_name: lastName,
                        updated_at: new Date()
                    }
                });
                userIdForReward = newUser.id
            } else {
                if (user.is_verified) {
                    throw createCustomError(409, "Email is already registered and verified");
                }
                const updateUser = await tx.user.update({
                    where: { email: email },
                    data: {
                        is_verified: true,
                        referral_code: referralCode,
                        password: hashedPassword,
                        first_name: firstName,
                        last_name: lastName,
                        updated_at: new Date()
                    }
                });
                userIdForReward = updateUser.id
            }

            if (refCode && refCode.trim() !== "") {
                const refCodeExist = await checkRefCode(refCode);
                if (!refCodeExist) throw createCustomError(404, "Referral code not found");
                const exp = new Date();
                exp.setMonth(exp.getMonth() + 1);

                await tx.user_Voucher.create({
                    data: {
                        user_id: userIdForReward,
                        voucher_code: 'REFERRAL-REWARD',
                        obtained_at: new Date(),
                        expired_at: exp
                    }
                })
            }

            await tx.token.delete({ where: { token: token } })
        })
    } catch (error) {
        throw error;
    }
}

export async function createTokens(user: UserProps) {
    const payload = {
        id: user.id,
        email: user.email,
        is_verified: user.is_verified,
        role: user.role,
        referral_code: user.referral_code,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        isStoreAdmin: !!user.storeAdmin,
        storeAdminId: user.storeAdmin?.id || null,
        storeId: user.storeAdmin?.storeId || null,
        storeName: user.storeAdmin?.store?.name || null
    }

    const accessToken = sign(payload, SECRET_KEY_ACCESS, { expiresIn: "15m" });
    const refreshToken = sign(payload, SECRET_KEY_REFRESH, { expiresIn: "30d" });

    return {
        accessToken,
        refreshToken
    }
}

export async function loginService(email: string, password: string) {
    try {
        const user = await checkEmail(email) as UserProps;
        if (!user) throw createCustomError(404, "Email or password invalid");
        if (!user.password) throw createCustomError(400, "Please login using social provider");
        if (!user.is_verified) throw createCustomError(403, "Please verify your email first");

        const passValid = await compare(password, user.password);
        if (!passValid) throw createCustomError(404, "Email or password invalid");

        const tokens = await createTokens(user);
        const { accessToken, refreshToken } = tokens;

        const exp = new Date();
        exp.setDate(exp.getDate() + 1)

        await prisma.refreshToken.deleteMany({
            where: { user_id: user.id, expires_at: { lt: new Date() } }
        });

        await prisma.refreshToken.create({
            data: {
                user_id: user.id,
                token: refreshToken,
                expires_at: exp
            }
        });

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw error;
    }
}

export async function refreshTokensService(token: string) {
    try {
        const findUser = await prisma.refreshToken.findUnique({
            where: { token: token },
            include: {user: true}
        });
        if (!findUser) throw createCustomError(404, "InvalidToken");

        if (new Date() > findUser.expires_at) {
            await prisma.refreshToken.delete({ where: { id: findUser.id } });
            throw createCustomError(401, "Refresh token expired. Please login again.");
        }

        const user = await checkEmail(findUser.user.email) as UserProps;
        if (!user) throw createCustomError(404, "User not found")

        const tokens = await createTokens(user);

        const exp = new Date();
        exp.setDate(exp.getDate() + 30);

        await prisma.refreshToken.update({
            where: { token: token },
            data: {
                expires_at: exp
            }
        })

        return {
            accessToken: tokens.accessToken,
            refreshToken: token
        }
    } catch (error) {
        throw error;
    }
}

export async function googleLoginService(email: string) {
    try {
        let user = await checkEmail(email) as UserProps;
        if (!user) {
            let referralCode = "";
            let isTaken = true;
            while (isTaken) {
                referralCode = referralCodeGenerator()
                const existingUser = await prisma.user.findUnique({
                    where: { referral_code: referralCode }
                });
                if (!existingUser) isTaken = false;
            }

            await createRegisTokenService(email);

            await prisma.user.create({
                data: {
                    email,
                    referral_code: referralCode,
                    updated_at: new Date()
                }
            });
        }

        if (!user) throw createCustomError(404, "User not found!")
        const tokens = await createTokens(user);
        const { accessToken, refreshToken } = tokens;

        const exp = new Date();
        exp.setDate(exp.getDate() + 30);

        prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            await prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    user_id: user.id,
                    expires_at: exp
                }
            });
        })

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw error;
    }
}