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

export const getProducts = async (businessId: number, categoryId?: number) => {
  return prisma.product.findMany({
    where: {
      businessId,
      ...(categoryId ? { categoryId } : {}),
    },
    include: { variants: true, category: true },
    orderBy: { createdAt: "desc" },
  });
};

// export const getProductById = async (id: number, businessId: number) => {
//   return prisma.product.findFirst({
//     where: { id, businessId },
//     include: { variants: true, category: true },
//   });
// };

// export const updateProduct = async (
//   id: number,
//   businessId: number,
//   data: { name?: string; description?: string; categoryId?: number | null }
// ) => {
//   const existing = await prisma.product.findFirst({ where: { id, businessId } });
//   if (!existing) return null;

//   return prisma.product.update({
//     where: { id },
//     data,
//     include: { variants: true, category: true },
//   });
// };

// export const deleteProduct = async (id: number, businessId: number) => {
//   const existing = await prisma.product.findFirst({ where: { id, businessId } });
//   if (!existing) return null;

//   await prisma.variant.deleteMany({ where: { productId: id } });
//   await prisma.product.delete({ where: { id } });

//   return true;
// };
