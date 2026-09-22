import type { Request, Response } from "express";
import type { Multer } from "multer";
import cloudinary from "../config/cloudinary";
import {
  addProductImage,
  deleteProductImage,
  getProductImages,
  setPrimaryImage,
} from "../services/productImage.service";
import { getProductById } from "../services/product.service";

export const addProductImageHandler = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { productId, isPrimary } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No image files provided" });
    }

    // Ownership check
    const product = await getProductById(
      Number(productId),
      req.user!.businessId,
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const uploadedImages = [];
    for (let file of files) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(file.buffer);
      });
      const savedImage = await addProductImage({
        productId: Number(productId),
        url: result.secure_url,
        isPrimary: isPrimary === "true",
      });
      uploadedImages.push(savedImage);
    }
    res.status(201).json({ images: uploadedImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

export const getProductImagesHandler = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const productImages = await getProductImages(Number(productId));
    res.status(200).json(productImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get product image" });
  }
};

export const deleteProductImageHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const deleted = await deleteProductImage(Number(id), req.user!.businessId);
    if (!deleted) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json({ message: "Image deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete product image" });
  }
};

export const setPrimaryImageHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await setPrimaryImage(Number(id));
    if (!updated) {
      return res.status(404).json({ message: "Product image not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update product image" });
  }
};
