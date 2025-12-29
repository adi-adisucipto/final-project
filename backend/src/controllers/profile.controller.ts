import { Request, Response, NextFunction } from "express";
import { updateUser } from "../services/profile.service";

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