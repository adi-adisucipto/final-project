import { sign, verify } from "jsonwebtoken";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { cloudinaryRemove, cloudinaryUplaod } from "../utils/cloudinary";
import { createCustomError } from "../utils/customError";
import { SECRET_KEY_REGIS } from "../configs/env.config";
import { compileChangePasswordTemplate } from "../helpers/compileTemplates";
import { transporter } from "../helpers/transporter";
import { checkEmail } from "./auth.service";
import { genSaltSync, hashSync } from "bcrypt";

export async function updateUser(email:string, first_name?:string, last_name?:string, file?:Express.Multer.File) {
    let secure_url: string | undefined = undefined;
    let public_id: string | undefined = undefined;

    if(file) {
        const image = await cloudinaryUplaod(file, "avatar");
        secure_url = image.secure_url;
        public_id = image.public_id;          
    }

    try {
        const user = await prisma.user.findUnique({
            where: {email: email}
        });
        if(!user) throw createCustomError(404, "User not found!");

        let data

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            if(user && user.avatar_id !== null && file !== null) {
                await cloudinaryRemove(user.avatar_id)
            }
            
            data = await tx.user.update({
                where: {email: email},
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    ...(secure_url && { avatar: secure_url }),
                    ...(public_id && { avatar_id: public_id })
                }
            });
        });

        return data
    } catch (error) {
        if(public_id) {
            await cloudinaryRemove(public_id)
        }
        throw error
    }
}

export async function sendEmailChangePasswordService(email:string) {
    try {
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

            const html = await compileChangePasswordTemplate(token);

            await transporter.sendMail({
                to: email,
                subject: "Change Password",
                html
            });
        })
    } catch (error) {
        throw error;
    }
}

export async function changePasswordService(token:string, password:string, confirmPassword:string) {
    try {
        const decoded = verify(token, SECRET_KEY_REGIS) as { email: string };
        const user = await checkEmail(decoded.email);
        if(!user) throw createCustomError(404, "User not found");

        if(password !== confirmPassword) throw createCustomError(400, "Password dan confirm password tidak cocok");
        const salt = genSaltSync(10);
        const hashedPassword = hashSync(password, salt);

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            await tx.user.update({
                where: {email: user.email},
                data: {password: hashedPassword}
            });

            await tx.token.delete({
                where: {token: token}
            })
        })
    } catch (error) {
        throw error;
    }
}