"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = updateUser;
exports.sendEmailChangePasswordService = sendEmailChangePasswordService;
exports.changePasswordService = changePasswordService;
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = require("../lib/prisma");
const cloudinary_1 = require("../utils/cloudinary");
const customError_1 = require("../utils/customError");
const env_config_1 = require("../configs/env.config");
const compileTemplates_1 = require("../helpers/compileTemplates");
const transporter_1 = require("../helpers/transporter");
const auth_service_1 = require("./auth.service");
const bcrypt_1 = require("bcrypt");
async function updateUser(email, first_name, last_name, file) {
    let secure_url = undefined;
    let public_id = undefined;
    if (file) {
        const image = await (0, cloudinary_1.cloudinaryUplaod)(file, "avatar");
        secure_url = image.secure_url;
        public_id = image.public_id;
    }
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: email }
        });
        if (!user)
            throw (0, customError_1.createCustomError)(404, "User not found!");
        let data;
        await prisma_1.prisma.$transaction(async (tx) => {
            if (user && user.avatar_id !== null && file !== null) {
                await (0, cloudinary_1.cloudinaryRemove)(user.avatar_id);
            }
            data = await tx.user.update({
                where: { email: email },
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    ...(secure_url && { avatar: secure_url }),
                    ...(public_id && { avatar_id: public_id })
                }
            });
        });
        return data;
    }
    catch (error) {
        if (public_id) {
            await (0, cloudinary_1.cloudinaryRemove)(public_id);
        }
        throw error;
    }
}
async function sendEmailChangePasswordService(email) {
    try {
        const payload = { email: email };
        const token = (0, jsonwebtoken_1.sign)(payload, env_config_1.SECRET_KEY_REGIS, { expiresIn: "1h" });
        const exp = new Date();
        exp.setHours(exp.getHours() + 1);
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.token.create({
                data: {
                    token: token,
                    expires_at: exp
                }
            });
            const html = await (0, compileTemplates_1.compileChangePasswordTemplate)(token);
            await transporter_1.transporter.sendMail({
                to: email,
                subject: "Change Password",
                html
            });
        });
    }
    catch (error) {
        throw error;
    }
}
async function changePasswordService(token, password, confirmPassword) {
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, env_config_1.SECRET_KEY_REGIS);
        const user = await (0, auth_service_1.checkEmail)(decoded.email);
        if (!user)
            throw (0, customError_1.createCustomError)(404, "User not found");
        if (password !== confirmPassword)
            throw (0, customError_1.createCustomError)(400, "Password dan confirm password tidak cocok");
        const salt = (0, bcrypt_1.genSaltSync)(10);
        const hashedPassword = (0, bcrypt_1.hashSync)(password, salt);
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { email: user.email },
                data: { password: hashedPassword }
            });
            await tx.token.delete({
                where: { token: token }
            });
        });
    }
    catch (error) {
        throw error;
    }
}
