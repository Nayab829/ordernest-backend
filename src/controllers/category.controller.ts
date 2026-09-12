import type { Request, Response } from "express";
import * as categoryService from "../services/category.service";

export const createCategoryHandler = async (req: Request, res: Response) => {
  // TODO: pull `name` from req.body, businessId from req.user
  // call categoryService.createCategory, send 201 response
  // wrap in try/catch, send 500 on error
};

export const getCategoriesHandler = async (req: Request, res: Response) => {
  // TODO: call categoryService.getCategories with req.user's businessId
  // send the result as JSON
};

export const getCategoryByIdHandler = async (req: Request, res: Response) => {
  // TODO: get id from req.params, call service, handle 404 if not found
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  // TODO: get id from req.params, name from req.body
  // call service, handle 404 if not found
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  // TODO: get id from req.params, call service, handle 404 if not found
};
