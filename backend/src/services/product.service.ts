import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { createCustomError } from "../utils/customError";
import {
  getCoords,
  getStoreByIdOrFail,
  getStoreOrFail,
  mapStoreSummary,
  StoreSummary,
} from "./product.store";

type CatalogParams = {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: "newest" | "price_asc" | "price_desc";
  lat?: number;
  lng?: number;
  storeId?: string;
};

type DetailParams = {
  productId: string;
  storeId?: string;
  lat?: number;
  lng?: number;
};

const catalogInclude = {
  product: {
    include: {
      images: { take: 1 },
      category: { select: { id: true, name: true } },
    },
  },
} as const;

const detailInclude = {
  product: {
    include: {
      images: true,
      category: { select: { id: true, name: true } },
    },
  },
} as const;

type CatalogItem = Prisma.ProductStockGetPayload<{
  include: typeof catalogInclude;
}>;

type DetailItem = Prisma.ProductStockGetPayload<{
  include: typeof detailInclude;
}>;

const buildPriceFilter = (params: CatalogParams) => {
  const price: Prisma.DecimalFilter = {};
  if (params.minPrice !== undefined) price.gte = params.minPrice;
  if (params.maxPrice !== undefined) price.lte = params.maxPrice;
  return Object.keys(price).length > 0 ? price : undefined;
};

const buildProductFilter = (params: CatalogParams) => {
  const product: Prisma.ProductWhereInput = { isActive: true };
  const price = buildPriceFilter(params);

  if (params.categoryId) product.categoryId = params.categoryId;
  if (price) product.price = price;
  if (params.search) {
    product.OR = [
      { name: { contains: params.search, mode: Prisma.QueryMode.insensitive } },
      {
        description: {
          contains: params.search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ];
  }

  return product;
};

const buildCatalogWhere = (storeId: string, params: CatalogParams) => ({
  storeId,
  quantity: { gt: 0 },
  product: buildProductFilter(params),
});

const buildOrderBy = (sort: CatalogParams["sort"]) => {
  if (sort === "price_asc") return { product: { price: Prisma.SortOrder.asc } };
  if (sort === "price_desc") {
    return { product: { price: Prisma.SortOrder.desc } };
  }
  return { product: { createdAt: Prisma.SortOrder.desc } };
};

const mapCatalogItem = (item: CatalogItem) => ({
  id: item.product.id,
  name: item.product.name,
  price: Number(item.product.price),
  imageUrl: item.product.images[0]?.imageUrl || "",
  category: item.product.category,
  stock: item.quantity,
});

const buildPagination = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

const getCatalogResults = (storeId: string, params: CatalogParams) => {
  const where = buildCatalogWhere(storeId, params);
  const orderBy = buildOrderBy(params.sort);
  const skip = (params.page - 1) * params.limit;

  return prisma.$transaction([
    prisma.productStock.findMany({
      where,
      orderBy,
      skip,
      take: params.limit,
      include: catalogInclude,
    }),
    prisma.productStock.count({ where }),
  ]);
};

export async function getProductCatalog(params: CatalogParams) {
  const store = params.storeId
    ? await getStoreByIdOrFail(params.storeId)
    : await getStoreOrFail(getCoords(params));
  const [items, total] = await getCatalogResults(store.id, params);

  return {
    store: mapStoreSummary(store),
    products: items.map(mapCatalogItem),
    pagination: buildPagination(params.page, params.limit, total),
  };
}

const getProductStock = (storeId: string, productId: string) =>
  prisma.productStock.findFirst({
    where: { storeId, productId, quantity: { gt: 0 } },
    include: detailInclude,
  });

const mapDetailItem = (store: StoreSummary, item: DetailItem) => ({
  store: mapStoreSummary(store),
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

const getDetailStore = (params: DetailParams) =>
  params.storeId
    ? getStoreByIdOrFail(params.storeId)
    : getStoreOrFail(getCoords(params));

export async function getProductDetail(params: DetailParams) {
  const store = await getDetailStore(params);
  const item = await getProductStock(store.id, params.productId);
  if (!item) throw createCustomError(404, "Product not found");
  return mapDetailItem(store, item);
}

export async function getProductCategories() {
  return prisma.productCategory.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
