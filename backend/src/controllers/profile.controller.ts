import { Request, Response, NextFunction } from "express";
import { changePasswordService, sendEmailChangePasswordService, updateUser } from "../services/profile.service";

export async function updateUserController(req:Request, res:Response, next:NextFunction) {
    try {
        const { email, first_name, last_name } = req.body;
        const file = req.file;

        const data = await updateUser(email, first_name, last_name, file);

        res.status(200).json({
            message: "Update success",
            data
        });
    } catch (error) {
        next(error)
    }
}

export async function sendEmailChangePasswordController(req: Request, res:Response, next:NextFunction) {
    try {
        const { email } = req.body;

        await sendEmailChangePasswordService(email);

        res.status(200).json({
            message: "Email has been sent. Please check your inbox!"
        })
    } catch (error) {
        next(error);
    }
}

export async function changePasswordController(req:Request, res:Response, next:NextFunction) {
    try {
        const {token, password, confirmPassword} = req.body
        await changePasswordService(token, password, confirmPassword);

        res.status(200).json({
            message: "Security update successful"
        })
    } catch (error) {
        next(error);
    }
}