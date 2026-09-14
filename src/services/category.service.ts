import { prisma } from "../lib/prisma";

export const createCategory = async (data: {
  name: string;
  businessId: number;
}) => {
  return await prisma.category.create({
    data: {
      name: data.name,
      businessId: data.businessId,
    },
  });
};

export const getCategories = async (businessId: number) => {
  return prisma.category.findMany({
    where: {
      businessId,
    },
  });
};

export const getCategoryById = async (id: number, businessId: number) => {
  return await prisma.category.findFirst({
    where: {
      id,
      businessId,
    },
  });
};

export const updateCategory = async (
  id: number,
  businessId: number,
  data: { name?: string },
) => {
  // TODO:
  const category = await prisma.category.findFirst({
    where: {
      id,
      businessId,
    },
  });
  if (!category) return null;
  return await prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: number, businessId: number) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      businessId,
    },
  });
  if (!category) return null;
  await prisma.product.updateMany({
    where: { categoryId: id },
    data: { categoryId: null },
  });
  await prisma.category.delete({
    where: { id },
  });
  return true;
};
