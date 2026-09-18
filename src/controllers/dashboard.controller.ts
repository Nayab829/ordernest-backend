import type { Request, Response } from "express";
import { getSalesSummary } from "../services/dashboard.service";

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
