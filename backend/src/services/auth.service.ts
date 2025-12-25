import { sign } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";
import { SECRET_KEY_REGIS } from "../configs/env.config";
import { Prisma } from "../generated/prisma/browser";
import { compileRegistrationTemplate } from "../helpers/compileTemplates";
import { transporter } from "../helpers/transporter";
import { referralCodeGenerator } from "../helpers/referralCode";
import { genSaltSync, hashSync } from "bcrypt";

export async function checkEmail(email:string) {
    const user = await prisma.user.findUnique({
        where: {email: email}
    });

    return user
}

export async function createRegisTokenService(email:string) {
    try {
        const isExist = await checkEmail(email);
        if(isExist !== null) {
            throw createCustomError(200, "User already exist, please login!");
        }

        const payload = { email: email }
        const token = sign(payload, SECRET_KEY_REGIS, {expiresIn: "1h"});
        const exp = new Date();
        exp.setHours(exp.getHours() + 1);

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            await tx.token.create({
                data: {
                    token: token,
                    expires_at: exp
                }
            });

            const html = await compileRegistrationTemplate(token);

            await transporter.sendMail({
                to: email,
                subject: "Registration",
                html
            });
        })
    } catch (error) {
        throw error;
    }
}

export async function checkRefCode(refCode: string) {
    const user = await prisma.user.findUnique({
        where: {referral_code: refCode}
    });

    return user;
};

export async function createUserService(email:string, password:string, firstName:string, lastName:string, refCode:string, token:string) {
    try {
        if (refCode && refCode.trim() !== "") {
            const refCodeExist = await checkRefCode(refCode);
            if (!refCodeExist) {
                throw createCustomError(404, "Referral code not found");
            }
        }

        const salt = genSaltSync(10);
        const hashedPassword = hashSync(password, salt);

        let isTaken = true;
        let referralCode: string 
        while(isTaken) {
            referralCode = referralCodeGenerator();
            const code = await prisma.user.findUnique({
                where: {
                    referral_code: referralCode
                }
            });

            if(!code) isTaken = false;
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            await tx.user.create({
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

            await tx.token.delete({
                where: {
                    token: token
                }
            })
        })
    } catch (error) {
        throw error;
    }
}