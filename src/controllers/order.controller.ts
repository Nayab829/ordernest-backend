// src/controllers/order.controller.ts
import type { Request, Response } from "express";
import {
  placeOrder,
  cancelOrder,
  updateOrderStatus,
  getOrderById,
  getOrders,
} from "../services/order.service";
import type { OrderStatus } from "../utils/orderStatus";

export async function createOrder(req: Request, res: Response) {
  try {
    const { customerName, items } = req.body;
    const { businessId } = req.user!;

    if (!customerName || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "customerName, and items are required" });
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

export async function getOrdersHandler(req: Request, res: Response) {
  try {
    // TODO:
    // 1. get businessId from req.user
    const businessId = req.user!.businessId;

    const statusQuery = req.query.status;

    const status: OrderStatus | undefined =
      typeof statusQuery === "string" &&
      VALID_STATUSES.includes(statusQuery as OrderStatus)
        ? (statusQuery as OrderStatus)
        : undefined;
    const orders = await getOrders(businessId, status);
    // 4. return the result as JSON
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to fetch orders",
    });
  }
}

export async function getOrderByIdHandler(req: Request, res: Response) {
  try {
    // TODO:
    // 1. get id from req.params, convert to Number
    const { id } = req.params;
    // 2. validate it's a valid number (same pattern as your other handlers)
    const orderId = Number(id);
    // 3. get businessId from req.user
    const businessId = req.user!.businessId;
    // 4. call getOrderById service function
    const order = await getOrderById(orderId, businessId);
    // 5. if not found, return 404
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    // 6. otherwise return the order as JSON
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to fetch order",
    });
  }
}
