import { mockReset, type DeepMockProxy } from "jest-mock-extended";
import { prisma } from "../../src/lib/prisma"; // ← changed: real path, not __mocks__
import type { PrismaClient } from "../../src/generated/prisma/client";
import { createCategory } from "../../src/services/category.service";

jest.mock("../../src/lib/prisma");
const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("createCategory", () => {
  it("should create a category with the given name and businessId", async () => {
    // ARRANGE: set up what we expect the fake Prisma to return
    const fakeCategory = {
      id: 1,
      name: "Abayas",
      businessId: 5,
      createdAt: new Date(),
    };
    prismaMock.category.create.mockResolvedValue(fakeCategory);

    // ACT: call the actual function we're testing
    const result = await createCategory({ name: "Abayas", businessId: 5 });

    // ASSERT: check the result is what we expect
    expect(result).toEqual(fakeCategory);
    expect(prismaMock.category.create).toHaveBeenCalledWith({
      data: { name: "Abayas", businessId: 5 },
    });
  });
});
