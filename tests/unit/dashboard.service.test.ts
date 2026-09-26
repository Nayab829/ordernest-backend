import { mockReset, type DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient } from "../../src/generated/prisma/client";
import { getSalesSummary } from "../../src/services/dashboard.service";
import { prisma } from "../../src/lib/prisma";
jest.mock("../../src/lib/prisma");
const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("getSalesSummary", () => {
  it("should correctly calculate total revenue and average order value", async () => {
    const fakeOrders = [
      { id: 1, items: [{ priceAtPurchase: 1000, quantity: 2 }] }, // 2000
      { id: 2, items: [{ priceAtPurchase: 500, quantity: 1 }] }, // 500
    ];

    prismaMock.order.findMany.mockResolvedValue(fakeOrders as any);
    (prismaMock.order.groupBy as any).mockResolvedValue([
      { status: "DELIVERED", _count: 2 },
    ] as any);

    const result = await getSalesSummary(5);

    expect(result.totalRevenue).toBe(2500);
    expect(result.totalOrders).toBe(2);
    expect(result.averageOrderValue).toBe(1250);
  });

  it("should return 0 average order value when there are no delivered orders", async () => {
    prismaMock.order.findMany.mockResolvedValue([]);
    (prismaMock.order.groupBy as any).mockResolvedValue([]);

    const result = await getSalesSummary(5);

    expect(result.totalRevenue).toBe(0);
    expect(result.totalOrders).toBe(0);
    expect(result.averageOrderValue).toBe(0);
  });
});
