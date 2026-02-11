"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpdateAddressSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUpdateAddressSchema = zod_1.default.object({
    firstName: zod_1.default.string()
        .min(3, "Nama depan minimal 3 karakter")
        .max(50, "Nama depan maksimal 50 karakter"),
    lastName: zod_1.default.string()
        .min(3, "Nama belakang minimal 3 karakter")
        .max(50, "Nama belakang maksimal 50 karakter"),
    provinceId: zod_1.default.coerce.number({ message: "Province ID harus berupa angka dan harus diisi" }).positive("Province ID harus angka positif"),
    cityId: zod_1.default.coerce.number({
        message: "City ID harus diisi",
    }).positive("City ID harus angka positif"),
    address: zod_1.default.string()
        .min(10, "Alamat lengkap minimal 10 karakter")
        .max(255, "Alamat terlalu panjang"),
    mainAddress: zod_1.default.coerce.boolean().default(false)
});
