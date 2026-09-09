import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";

type SignupInput = {
  email: string;
  password: string;
  businessName: string; // for now, signup also creates the Business (first user = Owner)
};

export async function signup(input: SignupInput) {
  const { email, password, businessName } = input;

  // 1. Check if email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("A user with this email already exists");
  }

  // 2. Hash the password — NEVER store plain text
  const passwordHash = await bcrypt.hash(password, 10); // 10 = salt rounds, a standard default

  // 3. Create Business + User together, atomically
  return await prisma.$transaction(async (tx) => {
    const business = await tx.business.create({
      data: { name: businessName },
    });

    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        role: "OWNER", // first user of a new business is always the Owner
        businessId: business.id,
      },
    });

    // Never return passwordHash to the client
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, business };
  });
}

type LoginInput = {
  email: string;
  password: string;
};

export async function login(input: LoginInput) {
  const { email, password } = input;

  // 1. Find the user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Compare provided password against the stored hash
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  // 3. Issue a JWT containing the info other parts of the app will need
  const token = jwt.sign(
    {
      userId: user.id,
      businessId: user.businessId,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  return { token };
}
