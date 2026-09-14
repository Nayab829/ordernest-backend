import { Router } from "express";
import {
  addProductImageHandler,
  getProductImagesHandler,
  deleteProductImageHandler,
  setPrimaryImageHandler,
} from "../controllers/productImage.controller";
import authMiddleware from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const router = Router();

router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  addProductImageHandler,
);
router.get("/:productId", authMiddleware, getProductImagesHandler);
router.delete("/:id", authMiddleware, deleteProductImageHandler);
router.patch("/:id/primary", authMiddleware, setPrimaryImageHandler);

export default router;
