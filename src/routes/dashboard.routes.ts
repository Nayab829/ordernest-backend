import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import {
  getBestSellingProductsHandler,
  getLowStockVariantsHandler,
  getPendingOrdersHandler,
  getRecentOrdersHandler,
  getRevenueOverTimeHandler,
  getSalesSummaryHandler,
} from "../controllers/dashboard.controller";

const router = Router();

router.get("/sales-summary", authMiddleware, getSalesSummaryHandler);
router.get("/low-stock", authMiddleware, getLowStockVariantsHandler);
router.get("/recent-orders", authMiddleware, getRecentOrdersHandler);
router.get("/pending-orders", authMiddleware, getPendingOrdersHandler);
router.get("/best-selling", authMiddleware, getBestSellingProductsHandler);
router.get("/revenue", authMiddleware, getRevenueOverTimeHandler);
export default router;
