import { prisma } from "../lib/prisma";
import { cloudinaryUplaod } from "../utils/cloudinary";
import { createCustomError } from "../utils/customError";

export type UploadedProductImage = {
  id: string;
  imageUrl: string;
  imageKey: string;
};

type CloudinaryImage = {
  imageUrl: string;
  imageKey: string;
};

const ensureProduct = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) throw createCustomError(404, "productId");
};

const uploadToCloudinary = async (file: Express.Multer.File) => {
  const upload = await cloudinaryUplaod(file, "products");
  return { imageUrl: upload.secure_url, imageKey: upload.public_id };
};

const saveImageRecord = (productId: string, image: CloudinaryImage) =>
  prisma.productImage.create({
    data: {
      productId,
      imageUrl: image.imageUrl,
      imageKey: image.imageKey,
    },
  });

const mapImageRecord = (image: { id: string; imageUrl: string; imageKey: string }) => ({
  id: image.id,
  imageUrl: image.imageUrl,
  imageKey: image.imageKey,
});

export async function uploadAdminProductImages(
  productId: string,
  files: Express.Multer.File[]
): Promise<UploadedProductImage[]> {
  await ensureProduct(productId);
  const uploads = await Promise.all(files.map(uploadToCloudinary));
  const records = await Promise.all(
    uploads.map((image) => saveImageRecord(productId, image))
  );
  return records.map(mapImageRecord);
}
