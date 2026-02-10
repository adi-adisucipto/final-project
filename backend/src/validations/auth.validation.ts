import z from "zod";

export const registerSchema = z.object({
    email: z.string().email("Invalid email format").min(1, "Email is required")
})

export const createUserSchema = z.object({
    firstName: z.string()
        .min(2, "Nama depan minimal 2 karakter")
        .max(50, "Nama depan terlalu panjang"),

    lastName: z.string()
        .min(1, "Nama belakang harus diisi")
        .max(50, "Nama belakang terlalu panjang"),

    password: z.string()
        .min(8, "Password minimal 8 karakter")
        .regex(/[A-Z]/, "Password harus mengandung minimal satu huruf kapital")
        .regex(/[0-9]/, "Password harus mengandung minimal satu angka"),

    refCode: z.string()
        .optional()
        .nullable()
        .transform((val) => {
            if (val === "" || val === undefined) return null;
            return val;
        })
});

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: z
        .string()
        .min(1, "Password is required"),
});