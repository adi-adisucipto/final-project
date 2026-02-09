"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmail = checkEmail;
exports.createRegisTokenService = createRegisTokenService;
exports.checkRefCode = checkRefCode;
exports.createUserService = createUserService;
exports.createTokens = createTokens;
exports.loginService = loginService;
exports.refreshTokensService = refreshTokensService;
exports.googleLoginService = googleLoginService;
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = require("../lib/prisma");
const customError_1 = require("../utils/customError");
const env_config_1 = require("../configs/env.config");
const compileTemplates_1 = require("../helpers/compileTemplates");
const transporter_1 = require("../helpers/transporter");
const referralCode_1 = require("../helpers/referralCode");
const bcrypt_1 = require("bcrypt");
async function checkEmail(email) {
    const user = await prisma_1.prisma.user.findUnique({
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
    return user;
}
async function createRegisTokenService(email) {
    const isExist = await checkEmail(email);
    if (isExist !== null) {
        throw (0, customError_1.createCustomError)(409, "User already exist, please login!");
    }
    const payload = { email: email };
    const token = (0, jsonwebtoken_1.sign)(payload, env_config_1.SECRET_KEY_REGIS, { expiresIn: "1h" });
    const exp = new Date();
    exp.setHours(exp.getHours() + 1);
    await prisma_1.prisma.token.create({
        data: {
            token: token,
            expires_at: exp
        }
    });
    try {
        const html = await (0, compileTemplates_1.compileRegistrationTemplate)(token);
        await transporter_1.transporter.sendMail({
            to: email,
            subject: "Registration",
            html
        });
    }
    catch (error) {
        await prisma_1.prisma.token.delete({
            where: { token: token }
        });
        throw new Error("Failed to send registration email. Please try again.");
    }
}
async function checkRefCode(refCode) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { referral_code: refCode }
    });
    return user;
}
;
async function createUserService(email, password, firstName, lastName, refCode, token) {
    try {
        const validToken = await prisma_1.prisma.token.findFirst({
            where: {
                token: token,
                expires_at: { gt: new Date() }
            }
        });
        if (!validToken) {
            throw (0, customError_1.createCustomError)(400, "Invalid or expired token");
        }
        const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
        const referralCode = await (0, referralCode_1.referralCodeGenerator)();
        const user = await checkEmail(email);
        await prisma_1.prisma.$transaction(async (tx) => {
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
                if (refCode && refCode.trim() !== "") {
                    const refCodeExist = await checkRefCode(refCode);
                    if (!refCodeExist)
                        throw (0, customError_1.createCustomError)(404, "Referral code not found");
                    const exp = new Date();
                    exp.setMonth(exp.getMonth() + 1);
                    await tx.user_Voucher.create({
                        data: {
                            user_id: newUser.id,
                            voucher_id: 'REFERRAL-REWARD',
                            obtained_at: new Date(),
                            expired_at: exp
                        }
                    });
                }
            }
            else {
                await tx.user.update({
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
            }
            await tx.token.delete({
                where: {
                    token: token
                }
            });
        });
    }
    catch (error) {
        throw error;
    }
}
async function createTokens(email) {
    try {
        const user = await checkEmail(email);
        if (!user)
            throw new Error("User not found!");
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
        };
        const accessToken = (0, jsonwebtoken_1.sign)(payload, env_config_1.SECRET_KEY_ACCESS, { expiresIn: "15m" });
        const refreshToken = (0, jsonwebtoken_1.sign)(payload, env_config_1.SECRET_KEY_REFRESH, { expiresIn: "30d" });
        return {
            accessToken,
            refreshToken
        };
    }
    catch (error) {
        throw error;
    }
}
async function loginService(email, password) {
    try {
        const user = await checkEmail(email);
        if (!user)
            throw (0, customError_1.createCustomError)(404, "Email or password invalid");
        const hashPass = user.password;
        if (!hashPass)
            throw (0, customError_1.createCustomError)(404, "Password not found");
        const passValid = (0, bcrypt_1.compareSync)(password, hashPass);
        if (!passValid)
            throw (0, customError_1.createCustomError)(404, "Email or password invalid");
        const tokens = await createTokens(email);
        const { accessToken, refreshToken } = tokens;
        const exp = new Date();
        exp.setDate(exp.getDate() + 30);
        await prisma_1.prisma.refreshToken.create({
            data: {
                user_id: user.id,
                token: refreshToken,
                expires_at: exp
            }
        });
        return {
            accessToken,
            refreshToken
        };
    }
    catch (error) {
        throw error;
    }
}
async function refreshTokensService(token) {
    try {
        const findUserId = await prisma_1.prisma.refreshToken.findUnique({
            where: { token: token },
            select: { user_id: true }
        });
        if (!findUserId)
            throw (0, customError_1.createCustomError)(404, "InvalidToken");
        const findEmail = await prisma_1.prisma.user.findUnique({
            where: { id: findUserId.user_id }
        });
        if (!findEmail)
            throw new Error("User not found!");
        const tokens = await createTokens(findEmail?.email);
        const exp = new Date();
        exp.setDate(exp.getDate() + 30);
        await prisma_1.prisma.refreshToken.update({
            where: { token: token },
            data: {
                expires_at: exp
            }
        });
        return {
            accessToken: tokens.accessToken,
            refreshToken: token
        };
    }
    catch (error) {
        throw error;
    }
}
async function googleLoginService(email) {
    try {
        let user = await checkEmail(email);
        if (!user) {
            const referralCode = await (0, referralCode_1.referralCodeGenerator)();
            ;
            await createRegisTokenService(email);
            await prisma_1.prisma.user.create({
                data: {
                    email,
                    referral_code: referralCode,
                    updated_at: new Date()
                }
            });
            user = await checkEmail(email);
        }
        if (!user)
            throw (0, customError_1.createCustomError)(404, "User not found!");
        const tokens = await createTokens(email);
        const { accessToken, refreshToken } = tokens;
        const exp = new Date();
        exp.setDate(exp.getDate() + 30);
        prisma_1.prisma.$transaction(async (tx) => {
            await prisma_1.prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    user_id: user.id,
                    expires_at: exp
                }
            });
        });
        return {
            accessToken,
            refreshToken
        };
    }
    catch (error) {
        throw error;
    }
}
