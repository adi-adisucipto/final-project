"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductCatalog = getProductCatalog;
exports.getProductDetail = getProductDetail;
exports.getProductCategories = getProductCategories;
const prisma_1 = require("../lib/prisma");
const client_1 = require("../generated/prisma/client");
const customError_1 = require("../utils/customError");
const product_store_1 = require("./product.store");
const catalogInclude = {
    product: {
        include: {
            images: { take: 1 },
            category: { select: { id: true, name: true } },
        },
    },
};
const detailInclude = {
    product: {
        include: {
            images: true,
            category: { select: { id: true, name: true } },
        },
    },
};
const buildPriceFilter = (params) => {
    const price = {};
    if (params.minPrice !== undefined)
        price.gte = params.minPrice;
    if (params.maxPrice !== undefined)
        price.lte = params.maxPrice;
    return Object.keys(price).length > 0 ? price : undefined;
};
const buildProductFilter = (params) => {
    const product = { isActive: true };
    const price = buildPriceFilter(params);
    if (params.categoryId)
        product.categoryId = params.categoryId;
    if (price)
        product.price = price;
    if (params.search) {
        product.OR = [
            { name: { contains: params.search, mode: client_1.Prisma.QueryMode.insensitive } },
            {
                description: {
                    contains: params.search,
                    mode: client_1.Prisma.QueryMode.insensitive,
                },
            },
        ];
    }
    return product;
};
const buildCatalogWhere = (storeId, params) => ({
    storeId,
    quantity: { gt: 0 },
    product: buildProductFilter(params),
});
const buildOrderBy = (sort) => {
    if (sort === "price_asc")
        return { product: { price: client_1.Prisma.SortOrder.asc } };
    if (sort === "price_desc") {
        return { product: { price: client_1.Prisma.SortOrder.desc } };
    }
    return { product: { createdAt: client_1.Prisma.SortOrder.desc } };
};
const mapCatalogItem = (item) => ({
    id: item.product.id,
    name: item.product.name,
    price: Number(item.product.price),
    imageUrl: item.product.images[0]?.imageUrl || "",
    category: item.product.category,
    stock: item.quantity,
});
const buildPagination = (page, limit, total) => ({
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
});
const getCatalogResults = (storeId, params) => {
    const where = buildCatalogWhere(storeId, params);
    const orderBy = buildOrderBy(params.sort);
    const skip = (params.page - 1) * params.limit;
    return prisma_1.prisma.$transaction([
        prisma_1.prisma.productStock.findMany({
            where,
            orderBy,
            skip,
            take: params.limit,
            include: catalogInclude,
        }),
        prisma_1.prisma.productStock.count({ where }),
    ]);
};
async function getProductCatalog(params) {
    const store = await (0, product_store_1.getStoreOrFail)((0, product_store_1.getCoords)(params));
    const [items, total] = await getCatalogResults(store.id, params);
    return {
        store: (0, product_store_1.mapStoreSummary)(store),
        products: items.map(mapCatalogItem),
        pagination: buildPagination(params.page, params.limit, total),
    };
}
const getProductStock = (storeId, productId) => prisma_1.prisma.productStock.findFirst({
    where: { storeId, productId, quantity: { gt: 0 } },
    include: detailInclude,
});
const mapDetailItem = (store, item) => ({
    store: (0, product_store_1.mapStoreSummary)(store),
    product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description || "",
        price: Number(item.product.price),
        images: item.product.images.map((image) => image.imageUrl),
        category: item.product.category,
        stock: item.quantity,
    },
});
const getDetailStore = (params) => params.storeId
    ? (0, product_store_1.getStoreByIdOrFail)(params.storeId)
    : (0, product_store_1.getStoreOrFail)((0, product_store_1.getCoords)(params));
async function getProductDetail(params) {
    const store = await getDetailStore(params);
    const item = await getProductStock(store.id, params.productId);
    if (!item)
        throw (0, customError_1.createCustomError)(404, "Product not found");
    return mapDetailItem(store, item);
}
async function getProductCategories() {
    return prisma_1.prisma.productCategory.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });
}
