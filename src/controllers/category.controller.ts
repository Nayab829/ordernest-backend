import type { Request, Response } from "express";
import * as categoryService from "../services/category.service";

export const createCategoryHandler = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const { businessId } = req.user!;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const createdCategory = await categoryService.createCategory({
      name,
      businessId,
    });
    res.status(201).json({ category: createdCategory });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Category with this name already exists" });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to create category" });
  }
};

export const getCategoriesHandler = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.user!;
    const categories = await categoryService.getCategories(businessId);
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

export const getCategoryByIdHandler = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getCategoryById(
      Number(req.params.id),
      req.user!.businessId,
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch category" });
  }
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await categoryService.updateCategory(
      Number(req.params.id),
      req.user!.businessId,
      { name },
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update category" });
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  try {
    const deleted = await categoryService.deleteCategory(
      Number(req.params.id),
      req.user!.businessId,
    );
    if (!deleted) {
      return res.status(404).json({ message: "Cateory not found" });
    }
    res.status(200).json({ message: "category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};
