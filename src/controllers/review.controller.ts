import type { Request, Response } from "express";
import * as reviewService from "../services/review.service";

export const createReviewHandler = async (req: Request, res: Response) => {
  try {
    const { productId, customerName, rating, comment } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1 to 5" });
    }

    const review = await reviewService.createReview({
      productId,
      customerName,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while posting review" });
  }
};

export const getReviewsForProductHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewService.getReviewsForProduct(Number(productId));
    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while getting review" });
  }
};

export const deleteReviewHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await reviewService.deleteReview(
      Number(id),
      req.user!.businessId,
    );
    if (!deleted) {
      return res.status(404).json({ message: "Review not found." });
    }
    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while deleting review" });
  }
};
