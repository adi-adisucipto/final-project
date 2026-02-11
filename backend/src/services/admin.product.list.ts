import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { createCustomError } from "../utils/customError";

export type AdminListParams = {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: "newest" | "price_asc" | "price_desc";
  storeId?: string;
};

const adminInclude = {
  category: { select: { id: true, name: true } },
  images: true,
} as const;

type AdminItem = Prisma.ProductGetPayload<{
  include: typeof adminInclude;
}>;

const mapAdminItem = (item: AdminItem) => ({
  id: item.id,
  name: item.name,
  description: item.description || "",
  price: Number(item.price),
  isActive: item.isActive,
  category: item.category,
  images: item.images.map((image) => image.imageUrl),
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

const buildProductWhere = (params: AdminListParams): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = {};
  const price = buildPriceFilter(params);
  const searchFilter = buildSearchFilter(params.search);
  if (params.categoryId) where.categoryId = params.categoryId;
  if (price) where.price = price;
  if (searchFilter) where.OR = searchFilter;
  if (params.storeId) {
    where.stocks = { some: { storeId: params.storeId } };
  }
  return where;
};

const buildOrderBy = (sort: AdminListParams["sort"]) => {
  if (sort === "price_asc") return { price: Prisma.SortOrder.asc };
  if (sort === "price_desc") return { price: Prisma.SortOrder.desc };
  return { createdAt: Prisma.SortOrder.desc };
};

const buildListQuery = (params: AdminListParams) => ({
  where: buildProductWhere(params),
  orderBy: buildOrderBy(params.sort),
  skip: (params.page - 1) * params.limit,
  take: params.limit,
});

const getAdminListResults = (params: AdminListParams) => {
  const query = buildListQuery(params);
  return prisma.$transaction([
    prisma.product.findMany({ ...query, include: adminInclude }),
    prisma.product.count({ where: query.where }),
  ]);
};

export async function listAdminProducts(params: AdminListParams) {
  const [items, total] = await getAdminListResults(params);
  return {
    products: items.map(mapAdminItem),
    pagination: buildPagination(params.page, params.limit, total),
  };
}

export async function getAdminProductItem(productId: string) {
  const item = await prisma.product.findUnique({
    where: { id: productId },
    include: adminInclude,
  });
  if (!item) throw createCustomError(404, "Product not found");
  return mapAdminItem(item);
}
