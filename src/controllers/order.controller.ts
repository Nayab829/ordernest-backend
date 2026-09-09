// src/controllers/order.controller.ts
import type { Request, Response } from "express";
import {
  placeOrder,
  cancelOrder,
  updateOrderStatus,
} from "../services/order.service";
import type { OrderStatus } from "../utils/orderStatus";
// (Note: businessId is coming from the request body here just for now — once auth/RBAC is in place, this should come from the logged-in user's session/token instead, not something the client sends freely. Flagging this so it's not forgotten.)

export async function createOrder(req: Request, res: Response) {
  try {
    const { businessId, customerName, items } = req.body;

    if (
      !businessId ||
      !customerName ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "businessId, customerName, and items are required" });
    }

    const order = await placeOrder(businessId, customerName, items);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : "Failed to place order",
    });
  }
}

export async function cancelOrderHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const orderId = Number(id);

    if (!id || isNaN(orderId)) {
      return res.status(400).json({ error: "A valid order ID is required" });
    }

    const order = await cancelOrder(orderId);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : "Failed to cancel order",
    });
  }
}

const VALID_STATUSES: OrderStatus[] = [
  "NEW",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export async function updateOrderStatusHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const orderId = Number(id);

    if (!id || isNaN(orderId)) {
      return res.status(400).json({ error: "A valid order ID is required" });
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `status must be one of: ${VALID_STATUSES.join(", ")}. Use the /cancel endpoint to cancel an order.`,
      });
    }

    const order = await updateOrderStatus(orderId, status);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({
      error:
        err instanceof Error ? err.message : "Failed to update order status",
    });
  }
}
