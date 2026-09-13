import type { Request, Response } from "express";
import * as productImageService from "../services/productImage.service";
import cloudinary from "../config/cloudinary";

export const addProductImageHandler = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // TODO: upload req.file.buffer to Cloudinary using cloudinary.uploader.upload_stream
    // then call productImageService.addProductImage with the resulting secure_url
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

export const getProductImagesHandler = async (req: Request, res: Response) => {
  // TODO: get productId from req.params, call service, return JSON
};

export const deleteProductImageHandler = async (
  req: Request,
  res: Response,
) => {
  // TODO: get id from req.params, call service with req.user!.businessId, handle not-found
};

export const setPrimaryImageHandler = async (req: Request, res: Response) => {
  // TODO: get id and productId, call service
};
