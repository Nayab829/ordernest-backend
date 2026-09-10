import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
interface JwtPayload {
  userId: string;
  businessId: number;
  role: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
