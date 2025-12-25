import { sign } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";
import { SECRET_KEY_REGIS } from "../configs/env.config";
import { Prisma } from "../generated/prisma/browser";
import { compileRegistrationTemplate } from "../helpers/compileTemplates";
import { transporter } from "../helpers/transporter";

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

        prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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