import { Router } from "express";

import {
  createProductHandler,
  getProductsHandler,
  getProductByIdHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../controllers/product.controller";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.post("/", authMiddleware, createProductHandler);
router.get("/", authMiddleware, getProductsHandler);
router.get("/:id", authMiddleware, getProductByIdHandler);
router.put("/:id", authMiddleware, updateProductHandler);
router.delete("/:id", authMiddleware, deleteProductHandler);

export default router;
