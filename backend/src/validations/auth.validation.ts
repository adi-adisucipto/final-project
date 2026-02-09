import z from "zod";

export const registerSchema = z.object({
    email: z.string().email("Invalid email format").min(1, "Email is required")
})