import { mockDeep, mockReset, type DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient } from "../../src/generated/prisma/client";
import { cancelOrder, placeOrder } from "../../src/services/order.service";
import { prisma } from "../../src/lib/prisma";
jest.mock("../../src/lib/prisma");
const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
  // $transaction needs special handling: make it just run the callback immediately with our mock
  prismaMock.$transaction.mockImplementation((callback: any) =>
    callback(prismaMock),
  );
});

describe("placeOrder", () => {
  it("should create an order and deduct stock for each item", async () => {
    const fakeOrder = {
      id: 1,
      businessId: 5,
      customerName: "Ali",
      status: "NEW",
    };
    const fakeVariant = {
      id: 10,
      sku: "ABA-BLK-M",
      price: 3500,
      stockQuantity: 20,
    };

    prismaMock.order.create.mockResolvedValue(fakeOrder as any);
    prismaMock.variant.findUnique.mockResolvedValue(fakeVariant as any);
    prismaMock.variant.updateMany.mockResolvedValue({ count: 1 }); // count: 1 means stock check passed
    prismaMock.orderItem.create.mockResolvedValue({} as any);
    prismaMock.order.findUnique.mockResolvedValue({
      ...fakeOrder,
      items: [],
    } as any);

    const result = await placeOrder(5, "Ali", [{ variantId: 10, quantity: 2 }]);

    expect(prismaMock.order.create).toHaveBeenCalledWith({
      data: { businessId: 5, customerName: "Ali" },
    });
    expect(prismaMock.variant.updateMany).toHaveBeenCalledWith({
      where: { id: 10, stockQuantity: { gte: 2 } },
      data: { stockQuantity: { decrement: 2 } },
    });
    expect(result).toBeDefined();
  });

  it("should throw an error if there is not enough stock", async () => {
    const fakeOrder = { id: 1, businessId: 5, customerName: "Ali" };
    const fakeVariant = {
      id: 10,
      sku: "ABA-BLK-M",
      price: 3500,
      stockQuantity: 1,
    };

    prismaMock.order.create.mockResolvedValue(fakeOrder as any);
    prismaMock.variant.findUnique.mockResolvedValue(fakeVariant as any);
    prismaMock.variant.updateMany.mockResolvedValue({ count: 0 }); // count: 0 means stock check FAILED

    await expect(
      placeOrder(5, "Ali", [{ variantId: 10, quantity: 5 }]),
    ).rejects.toThrow("Not enough stock");
  });
});

describe("cancelOrder", () => {
  it("should restore stock and set status to CANCELLED for a valid order", async () => {
    const fakeOrder = {
      id: 1,
      businessId: 5,
      status: "NEW",
      items: [{ variantId: 10, quantity: 2 }],
    };

    prismaMock.order.findUnique.mockResolvedValue(fakeOrder as any);
    prismaMock.variant.update.mockResolvedValue({} as any);
    prismaMock.order.update.mockResolvedValue({
      ...fakeOrder,
      status: "CANCELLED",
    } as any);

    const result = await cancelOrder(1, 5);

    expect(prismaMock.variant.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { stockQuantity: { increment: 2 } },
    });
    expect(prismaMock.order.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: "CANCELLED" },
    });
  });

  it("should throw an error if order belongs to a different business", async () => {
    const fakeOrder = { id: 1, businessId: 99, status: "NEW", items: [] }; // different businessId

    prismaMock.order.findUnique.mockResolvedValue(fakeOrder as any);

    await expect(cancelOrder(1, 5)).rejects.toThrow("Order 1 not found");
  });
});
