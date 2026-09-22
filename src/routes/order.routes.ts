// src/routes/order.routes.ts
import { Router } from "express";
import {
  cancelOrderHandler,
  createOrder,
  getOrderByIdHandler,
  getOrdersHandler,
  updateOrderStatusHandler,
} from "../controllers/order.controller";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.post("/orders", authMiddleware, createOrder);
router.patch("/orders/:id/cancel", authMiddleware, cancelOrderHandler);
router.patch("/orders/:id/status", authMiddleware, updateOrderStatusHandler);
router.get("/orders/:id", authMiddleware, getOrderByIdHandler);
router.get("/orders", authMiddleware, getOrdersHandler);
export default router;
