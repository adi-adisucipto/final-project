"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestChangeEmailService = requestChangeEmailService;
exports.changeEmailService = changeEmailService;
const bcrypt_1 = require("bcrypt");
const prisma_1 = require("../lib/prisma");
const customError_1 = require("../utils/customError");
const jsonwebtoken_1 = require("jsonwebtoken");
const env_config_1 = require("../configs/env.config");
const compileTemplates_1 = require("../helpers/compileTemplates");
const transporter_1 = require("../helpers/transporter");
async function requestChangeEmailService(email, newEmail, password) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email: email } });
    if (!user)
        throw (0, customError_1.createCustomError)(404, "Email or password invalid");
    const hashPass = user.password;
    if (!hashPass)
        throw (0, customError_1.createCustomError)(404, "Password not found");
    const passValid = (0, bcrypt_1.compareSync)(password, hashPass);
    if (!passValid)
        throw (0, customError_1.createCustomError)(404, "Email or password invalid");
    const emailTaken = await prisma_1.prisma.user.findUnique({ where: { email: newEmail } });
    if (emailTaken)
        throw (0, customError_1.createCustomError)(400, "New email is already in use");
    const payload = { id: user.id, email: newEmail };
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
        const html = await (0, compileTemplates_1.compileChangeEmailTemplate)(token);
        await transporter_1.transporter.sendMail({
            to: newEmail,
            subject: "Confirm Email Change",
            html
        });
    });
}
async function changeEmailService(email, id, token) {
    const tokenRecord = await prisma_1.prisma.token.findFirst({
        where: {
            token: token,
            expires_at: { gt: new Date() }
        }
    });
    if (!tokenRecord)
        throw (0, customError_1.createCustomError)(400, "Invalid or expired token");
    return await prisma_1.prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({ where: { id: id } });
        if (!user)
            throw (0, customError_1.createCustomError)(404, "User not found");
        const emailTaken = await tx.user.findUnique({ where: { email: email } });
        if (emailTaken)
            throw (0, customError_1.createCustomError)(400, "Email is already taken");
        const updateUser = await tx.user.update({
            where: { id: id },
            data: { email: email }
        });
        await tx.token.delete({
            where: { id: tokenRecord.id }
        });
        return updateUser;
    });
}
