// src/routes/order.routes.ts
import { Router } from "express";
import {
  cancelOrderHandler,
  createOrder,
  updateOrderStatusHandler,
} from "../controllers/order.controller";

const router = Router();

router.post("/orders", createOrder);
router.patch("/orders/:id/cancel", cancelOrderHandler);
router.patch("/orders/:id/status", updateOrderStatusHandler);
export default router;
