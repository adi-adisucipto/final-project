"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAdminProducts = listAdminProducts;
exports.getAdminProductItem = getAdminProductItem;
const prisma_1 = require("../lib/prisma");
const client_1 = require("../generated/prisma/client");
const customError_1 = require("../utils/customError");
const adminInclude = {
    category: { select: { id: true, name: true } },
    images: true,
};
const mapAdminItem = (item) => ({
    id: item.id,
    name: item.name,
    description: item.description || "",
    price: Number(item.price),
    isActive: item.isActive,
    category: item.category,
    images: item.images.map((image) => image.imageUrl),
});
const buildPagination = (page, limit, total) => ({
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
});
const buildPriceFilter = (params) => {
    const price = {};
    if (params.minPrice !== undefined)
        price.gte = params.minPrice;
    if (params.maxPrice !== undefined)
        price.lte = params.maxPrice;
    return Object.keys(price).length ? price : undefined;
};
const buildSearchFilter = (search) => search
    ? [
        { name: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
        { description: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
    ]
    : undefined;
const buildProductWhere = (params) => {
    const where = {};
    const price = buildPriceFilter(params);
    const searchFilter = buildSearchFilter(params.search);
    if (params.categoryId)
        where.categoryId = params.categoryId;
    if (price)
        where.price = price;
    if (searchFilter)
        where.OR = searchFilter;
    return where;
};
const buildOrderBy = (sort) => {
    if (sort === "price_asc")
        return { price: client_1.Prisma.SortOrder.asc };
    if (sort === "price_desc")
        return { price: client_1.Prisma.SortOrder.desc };
    return { createdAt: client_1.Prisma.SortOrder.desc };
};
const buildListQuery = (params) => ({
    where: buildProductWhere(params),
    orderBy: buildOrderBy(params.sort),
    skip: (params.page - 1) * params.limit,
    take: params.limit,
});
const getAdminListResults = (params) => {
    const query = buildListQuery(params);
    return prisma_1.prisma.$transaction([
        prisma_1.prisma.product.findMany({ ...query, include: adminInclude }),
        prisma_1.prisma.product.count({ where: query.where }),
    ]);
};
async function listAdminProducts(params) {
    const [items, total] = await getAdminListResults(params);
    return {
        products: items.map(mapAdminItem),
        pagination: buildPagination(params.page, params.limit, total),
    };
}
async function getAdminProductItem(productId) {
    const item = await prisma_1.prisma.product.findUnique({
        where: { id: productId },
        include: adminInclude,
    });
    if (!item)
        throw (0, customError_1.createCustomError)(404, "Product not found");
    return mapAdminItem(item);
}
