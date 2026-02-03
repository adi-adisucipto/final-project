import * as fs from "fs/promises"
import { compile } from "handlebars"
import path from "path"
import { BASE_WEB_URL } from "../configs/env.config"

export async function compileRegistrationTemplate(token:string) {
    const targetPath = path.join(__dirname, "../templates", "registration.hbs");
    const templateSrc = await fs.readFile(targetPath, "utf-8");
    const compiledTemplate = compile(templateSrc);

    return compiledTemplate({
        redirect_url: `${BASE_WEB_URL}/verification?token=${token}`
    });
}

export async function compileChangePasswordTemplate(token:string) {
    const targetPath = path.join(__dirname, "../templates", "changePassword.hbs");
    const templateSrc = await fs.readFile(targetPath, "utf-8");
    const compiledTemplate = compile(templateSrc);

    return compiledTemplate({
        redirect_url: `${BASE_WEB_URL}/password?token=${token}`
    });
}

export async function compileChangeEmailTemplate(token:string) {
    const targetPath = path.join(__dirname, "../templates", "changeEmail.hbs");
    const templateSrc = await fs.readFile(targetPath, "utf-8");
    const compiledTemplate = compile(templateSrc);

    return compiledTemplate({
        redirect_url: `${BASE_WEB_URL}/change-email?token=${token}`
    });
}