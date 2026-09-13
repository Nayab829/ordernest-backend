import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
} from "../controllers/category.controller";

const router = Router();

router.post("/", authMiddleware, createCategoryHandler);
router.get("/", authMiddleware, getCategoriesHandler);
router.get("/:id", authMiddleware, getCategoryByIdHandler);
router.put("/:id", authMiddleware, updateCategoryHandler);
router.delete("/:id", authMiddleware, deleteCategoryHandler);

export default router;
