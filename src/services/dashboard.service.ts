import { prisma } from "../lib/prisma";

export async function getSalesSummary(businessId: number) {
  const orders = await prisma.order.findMany({
    where: {
      businessId,
      status: "DELIVERED",
    },
    include: { items: true },
  });
  let totalRevenue = 0;
  for (let order of orders) {
    for (const item of order.items) {
      totalRevenue += Number(item.priceAtPurchase) * item.quantity;
    }
  }
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const ordersByStatus = await prisma.order.groupBy({
    by: ["status"],
    where: {
      businessId,
    },
    _count: true,
  });

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    ordersByStatus,
  };
}

export async function getLowStockVariants(businessId: number) {
  const variants = await prisma.variant.findMany({
    where: {
      product: {
        businessId,
      },
    },
  });
  const lowStockVariants = variants.filter((v) => {
    return v.stockQuantity <= v.lowStockAt;
  });
  return lowStockVariants;
}

import prisma from "../lib/prisma"; // adjust path to your prisma client

export async function getRecentOrders(businessId: number, limit: number) {
  // TODO: fetch latest `limit` orders where order's business matches businessId
  // include whatever relations you need (e.g. customer, order items)
  // orderBy createdAt desc
}

export async function getPendingOrders(businessId: number) {
  // TODO: fetch orders where businessId matches AND status === "PENDING" (or your enum value)
}

export async function getBestSellingProducts(
  businessId: number,
  limit: number,
) {
  // TODO: figure out how to aggregate — likely need to group by productId/variantId
  // across order items, sum quantities, sort desc, take `limit`
  // check if prisma groupBy works here or if you need raw SQL
}

export async function getRevenueOverTime(businessId: number, range: string) {
  // TODO: fetch orders within a date range for businessId
  // group/aggregate revenue by day/week/month depending on `range`
}
