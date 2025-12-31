import * as Yup from "yup";

export const changePasswordSchema = Yup.object({
    password: Yup.string()
        .min(8, "Password minimal 8 karakter")
        .required("Password wajib diisi"),
    
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Password tidak cocok")
        .required("Konfirmasi password wajib diisi"),
});