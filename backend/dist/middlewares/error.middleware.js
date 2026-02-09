"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorMiddleware;
const customError_1 = require("../utils/customError");
const client_1 = require("../generated/prisma/client");
const zod_1 = require("zod");
function errorMiddleware(err, req, res, next) {
    let statusCode = 500;
    let message = "Internal server error";
    let errors = undefined;
    if (err instanceof customError_1.CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = "Validation Error";
        errors = err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
        }));
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409;
            message = "Data already exists (Duplicate entry)";
        }
    }
    else if (err instanceof Error) {
        console.error("SERVER ERROR:", err.message);
    }
    res.status(statusCode).json({
        status: statusCode >= 500 ? "error" : "fail",
        message: message,
        ...(errors && { errors })
    });
}
