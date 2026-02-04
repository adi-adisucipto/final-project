import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { createCustomError } from "../utils/customError";

export type AdminListParams = {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  storeId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: "newest" | "price_asc" | "price_desc";
};

const adminInclude = {
  product: {
    include: {
      category: { select: { id: true, name: true } },
      images: true,
    },
  },
  store: { select: { id: true, name: true } },
} as const;

type AdminItem = Prisma.ProductStockGetPayload<{
  include: typeof adminInclude;
}>;

const mapAdminItem = (item: AdminItem) => ({
  id: item.product.id,
  name: item.product.name,
  description: item.product.description || "",
  price: Number(item.product.price),
  isActive: item.product.isActive,
  stock: item.quantity,
  category: item.product.category,
  store: item.store,
  images: item.product.images.map((image) => image.imageUrl),
});

const buildPagination = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

const buildPriceFilter = (params: AdminListParams) => {
  const price: Prisma.DecimalFilter = {};
  if (params.minPrice !== undefined) price.gte = params.minPrice;
  if (params.maxPrice !== undefined) price.lte = params.maxPrice;
  return Object.keys(price).length ? price : undefined;
};

const buildSearchFilter = (search?: string) =>
  search
    ? [
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ]
    : undefined;

const buildProductWhere = (params: AdminListParams) => {
  const product: Prisma.ProductWhereInput = {};
  const price = buildPriceFilter(params);
  const searchFilter = buildSearchFilter(params.search);
  if (params.categoryId) product.categoryId = params.categoryId;
  if (price) product.price = price;
  if (searchFilter) product.OR = searchFilter;
  return product;
};

const buildAdminWhere = (params: AdminListParams) => {
  const where: Prisma.ProductStockWhereInput = {
    product: buildProductWhere(params),
  };
  if (params.storeId) where.storeId = params.storeId;
  return where;
};

const buildOrderBy = (sort: AdminListParams["sort"]) => {
  if (sort === "price_asc") return { product: { price: Prisma.SortOrder.asc } };
  if (sort === "price_desc") {
    return { product: { price: Prisma.SortOrder.desc } };
  }
  return { product: { createdAt: Prisma.SortOrder.desc } };
};

const buildListQuery = (params: AdminListParams) => ({
  where: buildAdminWhere(params),
  orderBy: buildOrderBy(params.sort),
  skip: (params.page - 1) * params.limit,
  take: params.limit,
});

const getAdminListResults = (params: AdminListParams) => {
  const query = buildListQuery(params);
  return prisma.$transaction([
    prisma.productStock.findMany({ ...query, include: adminInclude }),
    prisma.productStock.count({ where: query.where }),
  ]);
};

export async function listAdminProducts(params: AdminListParams) {
  const [items, total] = await getAdminListResults(params);
  return {
    products: items.map(mapAdminItem),
    pagination: buildPagination(params.page, params.limit, total),
  };
}

export async function getAdminProductItem(storeId: string, productId: string) {
  const item = await prisma.productStock.findFirst({
    where: { storeId, productId },
    include: adminInclude,
  });
  if (!item) throw createCustomError(404, "Product not found");
  return mapAdminItem(item);
}
