"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.createUserSchema = exports.registerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.registerSchema = zod_1.default.object({
    email: zod_1.default.string().email("Invalid email format").min(1, "Email is required")
});
exports.createUserSchema = zod_1.default.object({
    firstName: zod_1.default.string()
        .min(2, "Nama depan minimal 2 karakter")
        .max(50, "Nama depan terlalu panjang"),
    lastName: zod_1.default.string()
        .min(1, "Nama belakang harus diisi")
        .max(50, "Nama belakang terlalu panjang"),
    password: zod_1.default.string()
        .min(8, "Password minimal 8 karakter")
        .regex(/[A-Z]/, "Password harus mengandung minimal satu huruf kapital")
        .regex(/[0-9]/, "Password harus mengandung minimal satu angka"),
    refCode: zod_1.default.string()
        .optional()
        .nullable()
        .transform((val) => {
        if (val === "" || val === undefined)
            return null;
        return val;
    })
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default
        .string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: zod_1.default
        .string()
        .min(1, "Password is required"),
});
