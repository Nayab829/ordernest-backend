import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
interface Product {
  name: string;
  description?: string | null;
  businessId: number;
  categoryId?: number | null;
  variants?: any[];
}
export const createProduct = async (data: Product) => {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description ?? null, // normalize undefined to null
      businessId: data.businessId,
      categoryId: data.categoryId ?? null,
      variants: data.variants
        ? {
            create: data.variants.map((v) => ({
              sku: v.sku,
              size: v.size,
              color: v.color,
              price: v.price,
              stockQuantity: v.stockQuantity ?? 0,
              lowStockAt: v.lowStockAt ?? 3,
            })),
          }
        : undefined,
    },
    include: { variants: true, category: true },
  });
};

const SORTABLE_FIELDS = ["name", "createdAt"];

export const getFilteredProducts = async (filters: {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy: string;
  order: "asc" | "desc";
  page: number;
  limit: number;
}) => {
  const where: Prisma.ProductWhereInput = {};

  if (filters.search) {
    where.name = { contains: filters.search, mode: "insensitive" };
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.variants = {
      some: {
        price: {
          ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
          ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
        },
      },
    };
  }

  const skip = (filters.page - 1) * filters.limit;

  const sortBy = SORTABLE_FIELDS.includes(filters.sortBy)
    ? filters.sortBy
    : "createdAt";

  const products = await prisma.product.findMany({
    where,
    orderBy: { [sortBy]: filters.order },
    skip,
    take: filters.limit,
    include: { category: true, reviews: true, variants: true },
  });

  const total = await prisma.product.count({ where });

  return {
    data: products,
    pagination: {
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
};

export const getProductById = async (id: number, businessId: number) => {
  return prisma.product.findFirst({
    where: { id, businessId },
    include: { variants: true, category: true },
  });
};

export const updateProduct = async (
  id: number,
  businessId: number,
  data: { name?: string; description?: string; categoryId?: number | null },
) => {
  const existing = await prisma.product.findFirst({
    where: { id, businessId },
  });
  if (!existing) return null;

  return prisma.product.update({
    where: { id },
    data,
    include: { variants: true, category: true },
  });
};

export const deleteProduct = async (id: number, businessId: number) => {
  const existing = await prisma.product.findFirst({
    where: { id, businessId },
  });
  if (!existing) return null;

  await prisma.variant.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  return true;
};
