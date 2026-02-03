import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { createCustomError } from "../utils/customError";
import { getAdminProductItem, listAdminProducts } from "./admin.product.list";

export { listAdminProducts };

type BaseParams = {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  storeId: string;
};

type CreateParams = BaseParams & { isActive: boolean };

type UpdateParams = BaseParams & {
  id: string;
  isActive?: boolean;
  previousStoreId?: string;
};

const ensureStore = async (storeId: string) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { id: true },
  });
  if (!store) throw createCustomError(404, "storeId");
};

const ensureCategory = async (categoryId: string) => {
  const category = await prisma.productCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) throw createCustomError(404, "categoryId");
};

const ensureProduct = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) throw createCustomError(404, "productId");
};

const getNameConflictWhere = (name: string, productId?: string) => ({
  name: { equals: name, mode: Prisma.QueryMode.insensitive },
  ...(productId ? { id: { not: productId } } : {}),
});

const hasNameConflict = async (name: string, productId?: string) => {
  const existing = await prisma.product.findFirst({
    where: getNameConflictWhere(name, productId),
    select: { id: true },
  });
  return Boolean(existing);
};

const ensureUniqueName = async (name: string, productId?: string) => {
  if (await hasNameConflict(name, productId)) {
    throw createCustomError(400, "Product name already exists");
  }
};

const buildProductCreateData = (params: CreateParams) => ({
  name: params.name,
  description: params.description,
  price: params.price,
  categoryId: params.categoryId,
  isActive: params.isActive,
});

const buildStockCreateData = (params: CreateParams, productId: string) => ({
  productId,
  storeId: params.storeId,
  quantity: params.stock,
});

const createProductRecord = async (params: CreateParams) => {
  const product = await prisma.product.create({
    data: buildProductCreateData(params),
  });
  await prisma.productStock.create({
    data: buildStockCreateData(params, product.id),
  });
  return product.id;
};

const buildProductUpdateData = (params: UpdateParams) => {
  const data: Prisma.ProductUpdateInput = {
    name: params.name,
    description: params.description,
    price: params.price,
    category: { connect: { id: params.categoryId } },
  };
  if (params.isActive !== undefined) data.isActive = params.isActive;
  return data;
};

const buildStockUpsertData = (params: UpdateParams) => ({
  where: { productId_storeId: { productId: params.id, storeId: params.storeId } },
  update: { quantity: params.stock },
  create: { productId: params.id, storeId: params.storeId, quantity: params.stock },
});

const updateProductRecord = async (params: UpdateParams) => {
  await prisma.product.update({
    where: { id: params.id },
    data: buildProductUpdateData(params),
  });
  if (params.previousStoreId && params.previousStoreId !== params.storeId) {
    await prisma.productStock.deleteMany({
      where: { productId: params.id, storeId: params.previousStoreId },
    });
  }
  await prisma.productStock.upsert(buildStockUpsertData(params));
};

const deleteProductRecord = async (productId: string) => {
  await prisma.productImage.deleteMany({ where: { productId } });
  await prisma.productStock.deleteMany({ where: { productId } });
  await prisma.product.delete({ where: { id: productId } });
};

export async function createAdminProduct(params: CreateParams) {
  await ensureStore(params.storeId);
  await ensureCategory(params.categoryId);
  await ensureUniqueName(params.name);
  const productId = await createProductRecord(params);
  return getAdminProductItem(params.storeId, productId);
}

export async function updateAdminProduct(params: UpdateParams) {
  await ensureProduct(params.id);
  await ensureStore(params.storeId);
  await ensureCategory(params.categoryId);
  await ensureUniqueName(params.name, params.id);
  await updateProductRecord(params);
  return getAdminProductItem(params.storeId, params.id);
}

export async function deleteAdminProduct(productId: string) {
  await ensureProduct(productId);
  await deleteProductRecord(productId);
}
