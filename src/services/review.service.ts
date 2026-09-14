import { prisma } from "../lib/prisma";

export const createReview = async (data: {
  productId: number;
  customerName: string;
  rating: number;
  comment?: string;
}) => {
  return await prisma.review.create({
    data: {
      productId: data.productId,
      comment: data.comment,
      rating: data.rating,
      customerName: data.customerName,
    },
  });

  // Think: should you validate rating is 1-5 here, or in the controller?
};

export const getReviewsForProduct = async (productId: number) => {
  return await prisma.review.findMany({
    where: {
      productId: productId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deleteReview = async (id: number, businessId: number) => {
  const review = await prisma.review.findUnique({
    where: {
      id: id,
    },
    include: {
      product: true,
    },
  });
  if (!review || review.product.businessId !== businessId) return null;
  await prisma.review.delete({
    where: { id: id },
  });
  return true;
};
