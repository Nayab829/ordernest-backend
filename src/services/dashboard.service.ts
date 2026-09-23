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
      businessId,
      status: "NEW",
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

type Interval = "day" | "week" | "month";

const VALID_INTERVALS: Interval[] = ["day", "week", "month"];

export async function getRevenueOverTime(
  businessId: number,
  startDate: Date,
  endDate: Date,
  interval: Interval = "day",
) {
  if (!VALID_INTERVALS.includes(interval)) {
    throw new Error(`Invalid interval: ${interval}`);
  }

  if (startDate > endDate) {
    throw new Error("startDate must be before endDate");
  }

  const result = await prisma.$queryRaw<{ period: Date; revenue: number }[]>`
    SELECT
      series.period,
      COALESCE(SUM(oi.quantity * oi."priceAtPurchase"), 0)::float AS revenue
    FROM generate_series(
      DATE_TRUNC(${interval}, ${startDate}::timestamp),
      DATE_TRUNC(${interval}, ${endDate}::timestamp),
      ${`1 ${interval}`}::interval
    ) AS series(period)
    LEFT JOIN "Order" o
      ON DATE_TRUNC(${interval}, o."createdAt") = series.period
      AND o."businessId" = ${businessId}
      AND o.status != 'CANCELLED'::"OrderStatus"
    LEFT JOIN "OrderItem" oi
      ON oi."orderId" = o.id
    GROUP BY series.period
    ORDER BY series.period ASC
  `;

  return result.map((r) => ({
    period: r.period,
    revenue: r.revenue,
  }));
}
