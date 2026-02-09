"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAdminCategories = listAdminCategories;
exports.createAdminCategory = createAdminCategory;
exports.updateAdminCategory = updateAdminCategory;
exports.deleteAdminCategory = deleteAdminCategory;
const prisma_1 = require("../lib/prisma");
const client_1 = require("../generated/prisma/client");
const customError_1 = require("../utils/customError");
const buildWhere = (search) => {
    if (!search)
        return {};
    return { name: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } };
};
const buildPagination = (page, limit, total) => ({
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
});
const mapCategory = (item) => ({
    id: item.id,
    name: item.name,
    productCount: item._count.products,
    createdAt: item.createdAt,
});
async function listAdminCategories(params) {
    const where = buildWhere(params.search);
    const skip = (params.page - 1) * params.limit;
    const [items, totalCategories, totalProducts] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.productCategory.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: params.limit,
            include: { _count: { select: { products: true } } },
        }),
        prisma_1.prisma.productCategory.count({ where }),
        prisma_1.prisma.product.count(),
    ]);
    const avgProducts = totalCategories > 0 ? Math.round(totalProducts / totalCategories) : 0;
    return {
        categories: items.map(mapCategory),
        pagination: buildPagination(params.page, params.limit, totalCategories),
        stats: {
            totalCategories,
            totalProducts,
            avgProducts,
        },
    };
}
const hasDuplicateName = async (name, ignoreId) => {
    const existing = await prisma_1.prisma.productCategory.findFirst({
        where: {
            name: { equals: name, mode: client_1.Prisma.QueryMode.insensitive },
            ...(ignoreId ? { id: { not: ignoreId } } : {}),
        },
        select: { id: true },
    });
    return Boolean(existing);
};
const ensureCategoryExists = async (categoryId) => {
    const category = await prisma_1.prisma.productCategory.findUnique({
        where: { id: categoryId },
        select: { id: true },
    });
    if (!category)
        throw (0, customError_1.createCustomError)(404, "categoryId");
};
async function createAdminCategory(name) {
    if (await hasDuplicateName(name)) {
        throw (0, customError_1.createCustomError)(400, "Category name already exists");
    }
    const created = await prisma_1.prisma.productCategory.create({ data: { name } });
    return { id: created.id, name: created.name };
}
async function updateAdminCategory(categoryId, name) {
    await ensureCategoryExists(categoryId);
    if (await hasDuplicateName(name, categoryId)) {
        throw (0, customError_1.createCustomError)(400, "Category name already exists");
    }
    const updated = await prisma_1.prisma.productCategory.update({
        where: { id: categoryId },
        data: { name },
    });
    return { id: updated.id, name: updated.name };
}
async function deleteAdminCategory(categoryId) {
    await ensureCategoryExists(categoryId);
    const productCount = await prisma_1.prisma.product.count({
        where: { categoryId },
    });
    if (productCount > 0) {
        throw (0, customError_1.createCustomError)(400, "Category has products");
    }
    await prisma_1.prisma.productCategory.delete({ where: { id: categoryId } });
}
