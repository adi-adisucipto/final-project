import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";

const ALLOWED_FILE_EXTENSIONS = [".jpeg", ".jpg", ".png", ".gif"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 1 * 1024 * 1024;

export default function uploader() {
    const storage = multer.memoryStorage();
    const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const ext = path.extname(file.originalname);
        if(ALLOWED_FILE_EXTENSIONS.includes(ext) && ALLOWED_MIME_TYPES.includes(file.mimetype)){
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"));
        }
    }

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    })
}