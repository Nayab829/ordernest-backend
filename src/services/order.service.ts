// src/services/order.service.ts
import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { canTransition, type OrderStatus } from "../utils/orderStatus";

type OrderItemInput = {
  variantId: number;
  quantity: number;
};

export async function placeOrder(
  businessId: number,
  customerName: string,
  items: OrderItemInput[],
) {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const order = await tx.order.create({
      data: { businessId, customerName },
    });

    for (const item of items) {
      const variant = await tx.variant.findUnique({
        where: { id: item.variantId },
      });

      if (!variant) {
        throw new Error(`Variant ${item.variantId} not found`);
      }

      const result = await tx.variant.updateMany({
        where: {
          id: item.variantId,
          stockQuantity: { gte: item.quantity },
        },
        data: {
          stockQuantity: { decrement: item.quantity },
        },
      });

      if (result.count === 0) {
        throw new Error(
          `Not enough stock for variant ${variant.sku} (requested ${item.quantity}, available ${variant.stockQuantity})`,
        );
      }

      await tx.orderItem.create({
        data: {
          orderId: order.id,
          variantId: item.variantId,
          quantity: item.quantity,
          priceAtPurchase: variant.price,
        },
      });
    }

    return await tx.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    });
  });
}

export async function cancelOrder(orderId: number) {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Fetch the order WITH its items — you need this to know what stock to restore
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // 2. Validate the transition is allowed (only NEW or PROCESSING can be cancelled)
    if (!canTransition(order.status as OrderStatus, "CANCELLED")) {
      throw new Error(`Cannot cancel an order that is ${order.status}`);
    }

    // 3. Restore stock for every item in the order
    for (const item of order.items) {
      await tx.variant.update({
        where: { id: item.variantId },
        data: {
          stockQuantity: { increment: item.quantity },
        },
      });
    }

    // 4. Now update the status
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    // 5. Return the full, updated order with items
    return await tx.order.findUnique({
      where: { id: updatedOrder.id },
      include: { items: true },
    });
  });
}

export async function updateOrderStatus(
  orderId: number,
  newStatus: OrderStatus,
) {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (!canTransition(order.status as OrderStatus, newStatus)) {
      throw new Error(`Cannot move order from ${order.status} to ${newStatus}`);
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    return await tx.order.findUnique({
      where: { id: updatedOrder.id },
      include: { items: true },
    });
  });
}
