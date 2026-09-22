import type { NextFunction, Request, Response } from "express";
import {
  getBestSellingProducts,
  getLowStockVariants,
  getPendingOrders,
  getRecentOrders,
  getRevenueOverTime,
  getSalesSummary,
} from "../services/dashboard.service";

export async function getSalesSummaryHandler(req: Request, res: Response) {
  try {
    const businessId = req.user!.businessId;
    const salesSummary = await getSalesSummary(businessId);
    res.status(200).json(salesSummary);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Failed to fetch sales summary",
    });
  }
}

export async function getLowStockVariantsHandler(req: Request, res: Response) {
  try {
    const businessId = req.user!.businessId;
    const salesSummary = await getLowStockVariants(businessId);
    res.status(200).json(salesSummary);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Failed to fetch low stock items",
    });
  }
}

export async function getRecentOrdersHandler(req: Request, res: Response) {
  try {
    const businessId = req.user!.businessId;
    const { limit } = req.query;
    const recentOrders = await getRecentOrders(businessId, Number(limit));
    res.status(200).json(recentOrders);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Failed to fetch recent orders",
    });
  }
}

export async function getPendingOrdersHandler(req: Request, res: Response) {
  try {
    const businessId = req.user!.businessId;
    const { limit } = req.query;
    const pendingOrders = await getPendingOrders(businessId);
    res.status(200).json(pendingOrders);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Failed to fetch pending orders",
    });
  }
}

export async function getBestSellingProductsHandler(
  req: Request,
  res: Response,
) {
  try {
    const businessId = req.user!.businessId;
    const { limit } = req.query;
    const bestSellingProducts = await getBestSellingProducts(
      businessId,
      Number(limit),
    );
    res.status(200).json(bestSellingProducts);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Failed to fetch best selling product",
    });
  }
}

export async function getRevenueOverTimeHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const businessId = req.user!.businessId;
    if (!businessId || Number.isNaN(businessId)) {
      return res.status(400).json({ error: "Valid businessId is required" });
    }

    const { startDate, endDate, interval } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }

    const parsedStart = new Date(startDate as string);
    const parsedEnd = new Date(endDate as string);

    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const allowedIntervals = ["day", "week", "month"];
    const parsedInterval = (interval as string) ?? "day";
    if (!allowedIntervals.includes(parsedInterval)) {
      return res
        .status(400)
        .json({ error: "interval must be one of: day, week, month" });
    }

    const data = await getRevenueOverTime(
      businessId,
      parsedStart,
      parsedEnd,
      parsedInterval as "day" | "week" | "month",
    );

    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}
