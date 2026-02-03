import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { createCustomError } from "../utils/customError";

export type AdminCategoryListParams = {
  page: number;
  limit: number;
  search?: string;
};

type CategoryListItem = {
  id: string;
  name: string;
  productCount: number;
  createdAt: Date;
};

const buildWhere = (search?: string): Prisma.ProductCategoryWhereInput => {
  if (!search) return {};
  return { name: { contains: search, mode: Prisma.QueryMode.insensitive } };
};

const buildPagination = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

const mapCategory = (item: {
  id: string;
  name: string;
  createdAt: Date;
  _count: { products: number };
}): CategoryListItem => ({
  id: item.id,
  name: item.name,
  productCount: item._count.products,
  createdAt: item.createdAt,
});

export async function listAdminCategories(params: AdminCategoryListParams) {
  const where = buildWhere(params.search);
  const skip = (params.page - 1) * params.limit;
  const [items, totalCategories, totalProducts] = await prisma.$transaction([
    prisma.productCategory.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: params.limit,
      include: { _count: { select: { products: true } } },
    }),
    prisma.productCategory.count({ where }),
    prisma.product.count(),
  ]);

  const avgProducts =
    totalCategories > 0 ? Math.round(totalProducts / totalCategories) : 0;

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

const hasDuplicateName = async (name: string, ignoreId?: string) => {
  const existing = await prisma.productCategory.findFirst({
    where: {
      name: { equals: name, mode: Prisma.QueryMode.insensitive },
      ...(ignoreId ? { id: { not: ignoreId } } : {}),
    },
    select: { id: true },
  });
  return Boolean(existing);
};

const ensureCategoryExists = async (categoryId: string) => {
  const category = await prisma.productCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) throw createCustomError(404, "categoryId");
};

export async function createAdminCategory(name: string) {
  if (await hasDuplicateName(name)) {
    throw createCustomError(400, "Category name already exists");
  }
  const created = await prisma.productCategory.create({ data: { name } });
  return { id: created.id, name: created.name };
}

export async function updateAdminCategory(categoryId: string, name: string) {
  await ensureCategoryExists(categoryId);
  if (await hasDuplicateName(name, categoryId)) {
    throw createCustomError(400, "Category name already exists");
  }
  const updated = await prisma.productCategory.update({
    where: { id: categoryId },
    data: { name },
  });
  return { id: updated.id, name: updated.name };
}

export async function deleteAdminCategory(categoryId: string) {
  await ensureCategoryExists(categoryId);
  const productCount = await prisma.product.count({
    where: { categoryId },
  });
  if (productCount > 0) {
    throw createCustomError(400, "Category has products");
  }
  await prisma.productCategory.delete({ where: { id: categoryId } });
}
