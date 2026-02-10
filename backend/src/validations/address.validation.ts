import z from "zod";

export const createUpdateAddressSchema = z.object({
  firstName: z.string()
    .min(3, "Nama depan minimal 3 karakter")
    .max(50, "Nama depan maksimal 50 karakter"),
  
  lastName: z.string()
    .min(3, "Nama belakang minimal 3 karakter")
    .max(50, "Nama belakang maksimal 50 karakter"),

  provinceId: z.coerce.number(
    {message: "Province ID harus berupa angka dan harus diisi"}
    ).positive("Province ID harus angka positif"),

  cityId: z.coerce.number({
    message: "City ID harus diisi",
  }).positive("City ID harus angka positif"),

  address: z.string()
    .min(10, "Alamat lengkap minimal 10 karakter")
    .max(255, "Alamat terlalu panjang"),

  mainAddress: z.coerce.boolean().default(false)
});