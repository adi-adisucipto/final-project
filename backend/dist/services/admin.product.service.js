"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAdminProducts = void 0;
exports.createAdminProduct = createAdminProduct;
exports.updateAdminProduct = updateAdminProduct;
exports.deleteAdminProduct = deleteAdminProduct;
const prisma_1 = require("../lib/prisma");
const client_1 = require("../generated/prisma/client");
const customError_1 = require("../utils/customError");
const admin_product_list_1 = require("./admin.product.list");
Object.defineProperty(exports, "listAdminProducts", { enumerable: true, get: function () { return admin_product_list_1.listAdminProducts; } });
const ensureCategory = async (categoryId) => {
    const category = await prisma_1.prisma.productCategory.findUnique({
        where: { id: categoryId },
        select: { id: true },
    });
    if (!category)
        throw (0, customError_1.createCustomError)(404, "categoryId");
};
const ensureProduct = async (productId) => {
    const product = await prisma_1.prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
    });
    if (!product)
        throw (0, customError_1.createCustomError)(404, "productId");
};
const getNameConflictWhere = (name, productId) => ({
    name: { equals: name, mode: client_1.Prisma.QueryMode.insensitive },
    ...(productId ? { id: { not: productId } } : {}),
});
const hasNameConflict = async (name, productId) => {
    const existing = await prisma_1.prisma.product.findFirst({
        where: getNameConflictWhere(name, productId),
        select: { id: true },
    });
    return Boolean(existing);
};
const ensureUniqueName = async (name, productId) => {
    if (await hasNameConflict(name, productId)) {
        throw (0, customError_1.createCustomError)(400, "Product name already exists");
    }
};
const buildProductCreateData = (params) => ({
    name: params.name,
    description: params.description,
    price: params.price,
    categoryId: params.categoryId,
    isActive: params.isActive,
});
const createProductRecord = async (params) => {
    const product = await prisma_1.prisma.product.create({
        data: buildProductCreateData(params),
    });
    return product.id;
};
const buildProductUpdateData = (params) => {
    const data = {
        name: params.name,
        description: params.description,
        price: params.price,
        category: { connect: { id: params.categoryId } },
    };
    if (params.isActive !== undefined)
        data.isActive = params.isActive;
    return data;
};
const updateProductRecord = async (params) => {
    await prisma_1.prisma.product.update({
        where: { id: params.id },
        data: buildProductUpdateData(params),
    });
};
const deleteProductRecord = async (productId) => {
    await prisma_1.prisma.productImage.deleteMany({ where: { productId } });
    await prisma_1.prisma.productStock.deleteMany({ where: { productId } });
    await prisma_1.prisma.product.delete({ where: { id: productId } });
};
async function createAdminProduct(params) {
    await ensureCategory(params.categoryId);
    await ensureUniqueName(params.name);
    const productId = await createProductRecord(params);
    return (0, admin_product_list_1.getAdminProductItem)(productId);
}
async function updateAdminProduct(params) {
    await ensureProduct(params.id);
    await ensureCategory(params.categoryId);
    await ensureUniqueName(params.name, params.id);
    await updateProductRecord(params);
    return (0, admin_product_list_1.getAdminProductItem)(params.id);
}
async function deleteAdminProduct(productId) {
    await ensureProduct(productId);
    await deleteProductRecord(productId);
}
