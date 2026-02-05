import { compareSync } from "bcrypt";
import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";
import { sign } from "jsonwebtoken";
import { SECRET_KEY_REGIS } from "../configs/env.config";
import { Prisma } from "../generated/prisma/client";
import { compileChangeEmailTemplate } from "../helpers/compileTemplates";
import { transporter } from "../helpers/transporter";

export async function requestChangeEmailService(email: string, newEmail: string, password: string) {
    const user = await prisma.user.findUnique({where: {email: email}});
    if(!user) throw createCustomError(404, "Email or password invalid");
    const hashPass = user.password
    if(!hashPass) throw createCustomError(404, "Password not found");
    const passValid = compareSync(password, hashPass);
    if(!passValid) throw createCustomError(404, "Email or password invalid");
    const emailTaken = await prisma.user.findUnique({ where: { email: newEmail }});
    if (emailTaken) throw createCustomError(400, "New email is already in use");

    const payload = { id: user.id, email: newEmail }
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

        const html = await compileChangeEmailTemplate(token);

        await transporter.sendMail({
            to: newEmail,
            subject: "Confirm Email Change",
            html
        });
    })
}

export async function changeEmailService(email:string, id:string, token:string) {
    const tokenRecord = await prisma.token.findFirst({
        where: { 
            token: token,
            expires_at: { gt: new Date() }
        }
    });
    if (!tokenRecord) throw createCustomError(400, "Invalid or expired token");

    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({where: {id: id}});
        if(!user) throw createCustomError(404, "User not found");

        const emailTaken = await tx.user.findUnique({ where: { email: email }});
        if (emailTaken) throw createCustomError(400, "Email is already taken");

        const updateUser = await tx.user.update({
            where: {id: id},
            data: {email: email}
        });

        await tx.token.delete({
            where: { id: tokenRecord.id }
        });

        return updateUser
    })
}