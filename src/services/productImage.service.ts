import { prisma } from "../lib/prisma";

export const addProductImage = async (data: {
  productId: number;
  url: string;
  isPrimary?: boolean;
}) => {
  if (data.isPrimary) {
    await prisma.productImage.updateMany({
      where: { id: data.productId },
      data: {
        isPrimary: false,
      },
    });
  }
  return prisma.productImage.create({
    data: {
      productId: data.productId,
      url: data.url,
      isPrimary: data.isPrimary ?? false,
    },
  });
};

export const getProductImages = async (productId: number) => {
  return prisma.productImage.findMany({
    where: { productId },
    orderBy: { createdAt: "asc" },
  });
};

export const deleteProductImage = async (id: number, businessId: number) => {
  const image = await prisma.productImage.findFirst({
    where: { id },
    include: { product: true },
  });
  if (!image || image?.product.businessId !== businessId) {
    return null;
  }
  await prisma.productImage.delete({ where: { id: id } });
  return true;
};

export const setPrimaryImage = async (id: number) => {
  const image = await prisma.productImage.findUnique({
    where: { id },
  });

  if (!image) return null;
  const [, updated] = await prisma.$transaction([
    prisma.productImage.updateMany({
      where: { id: image.productId },
      data: { isPrimary: false },
    }),
    prisma.productImage.update({
      where: { id: id },
      data: { isPrimary: true },
    }),
  ]);
  return updated;
};
