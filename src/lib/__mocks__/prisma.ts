import { mockDeep } from "jest-mock-extended";
import type { PrismaClient } from "../../generated/prisma/client";

export const prisma = mockDeep<PrismaClient>();
