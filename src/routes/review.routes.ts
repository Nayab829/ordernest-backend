import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import {
  createReviewHandler,
  getReviewsForProductHandler,
  deleteReviewHandler,
} from "../controllers/review.controller";

const router = Router();

router.post("/", createReviewHandler);
router.get("/:productId", getReviewsForProductHandler); // public - no authMiddleware
router.delete("/:id", authMiddleware, deleteReviewHandler); // protected

export default router;
