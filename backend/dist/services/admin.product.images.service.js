"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAdminProductImages = uploadAdminProductImages;
const prisma_1 = require("../lib/prisma");
const cloudinary_1 = require("../utils/cloudinary");
const customError_1 = require("../utils/customError");
const ensureProduct = async (productId) => {
    const product = await prisma_1.prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
    });
    if (!product)
        throw (0, customError_1.createCustomError)(404, "productId");
};
const uploadToCloudinary = async (file) => {
    const upload = await (0, cloudinary_1.cloudinaryUplaod)(file, "products");
    return { imageUrl: upload.secure_url, imageKey: upload.public_id };
};
const saveImageRecord = (productId, image) => prisma_1.prisma.productImage.create({
    data: {
        productId,
        imageUrl: image.imageUrl,
        imageKey: image.imageKey,
    },
});
const mapImageRecord = (image) => ({
    id: image.id,
    imageUrl: image.imageUrl,
    imageKey: image.imageKey,
});
async function uploadAdminProductImages(productId, files) {
    await ensureProduct(productId);
    const uploads = await Promise.all(files.map(uploadToCloudinary));
    const records = await Promise.all(uploads.map((image) => saveImageRecord(productId, image)));
    return records.map(mapImageRecord);
}
