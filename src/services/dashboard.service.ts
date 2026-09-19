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

export async function getRecentOrders(businessId: number, limit: number) {
  return await prisma.order.findMany({
    where: {
      businessId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      items: true,
    },
  });
}

export async function getPendingOrders(businessId: number) {
  return await prisma.order.count({
    where: {
      status: "PROCESSING",
    },
  });
}

export async function getBestSellingProducts(
  businessId: number,
  limit: number,
) {
  const grouped = await prisma.orderItem.groupBy({
    by: ["variantId"],
    where: {
      order: {
        businessId,
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: limit,
  });

  const variantIds = grouped.map((g) => g.variantId);

  const variants = await prisma.variant.findMany({
    where: {
      id: {
        in: variantIds,
      },
    },
    include: {
      product: true,
    },
  });

  const result = grouped.map((g) => {
    const variant = variants.find((v) => v.id === g.variantId);
    return {
      variant,
      totalSold: g._sum.quantity ?? 0,
    };
  });

  return result;
}

export async function getRevenueOverTime(businessId: number, range: string) {
  // TODO: fetch orders within a date range for businessId
  // group/aggregate revenue by day/week/month depending on `range`
}
