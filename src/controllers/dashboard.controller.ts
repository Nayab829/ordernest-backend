import type { Request, Response } from "express";
import {
  getLowStockVariants,
  getRecentOrders,
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
  // TODO: extract businessId (from params/auth), validate it
  // extract & validate optional `limit` query param, set a sensible default
  // call service, handle errors, send response
  try {
    const businessId = req.user!.businessId;
    const {limit} = req.query;
    const recentOrders = await getRecentOrders(businessId,Number(limit))
    res.status(200).json(recentOrders)
  } catch (err) {
     res.status(500).json({
      error:
        err instanceof Error ? err.message : "Failed to fetch recent orders",
  })
}

export async function getPendingOrdersHandler(req: Request, res: Response) {
  // TODO: same pattern — validate businessId, call service, respond
}

export async function getBestSellingProductsHandler(
  req: Request,
  res: Response,
) {
  // TODO: validate businessId + limit, call service, respond
}

export async function getRevenueOverTimeHandler(req: Request, res: Response) {
  // TODO: validate businessId + range param (e.g. "7d", "30d", "12m")
  // decide: should invalid range fall back to default or return 400?
}
