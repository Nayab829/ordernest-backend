import type { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../services/product.service";

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const { name, description, categoryId, variants } = req.body;

    const product = await createProduct({
      name,
      description,
      businessId: req.user!.businessId,
      categoryId,
      variants,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product" });
  }
};

export const getProductsHandler = async (req: Request, res: Response) => {
  try {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "desc",
      page = "1",
      limit = "20",
    } = req.query;

    const products = await productService.getFilteredProducts({
      search: search as string,
      categoryId: categoryId as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: sortBy as string,
      order: order as "asc" | "desc",
      page: Number(page),
      limit: Number(limit),
    });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductByIdHandler = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(
      Number(req.params.id),
      req.user!.businessId,
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const updateProductHandler = async (req: Request, res: Response) => {
  try {
    const { name, description, categoryId } = req.body;
    const updated = await updateProduct(
      Number(req.params.id),
      req.user!.businessId,
      { name, description, categoryId },
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteProduct(
      Number(req.params.id),
      req.user!.businessId,
    );

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
