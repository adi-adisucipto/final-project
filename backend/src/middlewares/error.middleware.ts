import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { Prisma } from "../generated/prisma/client";
import { ZodError } from "zod";

export default function errorMiddleware(
    err: unknown,
    req:Request,
    res:Response,
    next:NextFunction
) {
    let statusCode = 500;
    let message = "Internal server error";
    let errors: any = undefined;

    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation Error";
        errors = err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
        }));
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409;
            message = "Data already exists (Duplicate entry)";
        }
    } else if (err instanceof Error) {
        console.error("SERVER ERROR:", err.message);
    }

    res.status(statusCode).json({
        status: statusCode >= 500 ? "error" : "fail",
        message: message,
        ...(errors && {errors})
    });
}