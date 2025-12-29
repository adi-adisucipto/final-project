import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { cloudinaryRemove, cloudinaryUplaod } from "../utils/cloudinary";
import { createCustomError } from "../utils/customError";

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