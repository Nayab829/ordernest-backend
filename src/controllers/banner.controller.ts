import type { Request, Response } from "express";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import { prisma } from "../lib/prisma"; // adjust to your actual import path
import {
  createBanner,
  getBanners,
  getBannerById,
  getAllBannersForAdmin,
  updateBanner,
  deleteBanner,
} from "../services/banner.service";

export const createBannerHandler = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { title, link } = req.body;
    const businessId = req.user!.businessId;

    const desktopFile = files?.desktopImage?.[0];
    const mobileFile = files?.mobileImage?.[0];

    if (!desktopFile || !mobileFile) {
      return res.status(400).json({ message: "Both desktop and mobile images are required" });
    }

    const [desktopResult, mobileResult]: any[] = await Promise.all([
      uploadToCloudinary(desktopFile, "banners"),
      uploadToCloudinary(mobileFile, "banners"),
    ]);

    const banner = await createBanner({
      businessId,
      title,
      link,
      desktopImage: desktopResult.secure_url,
      mobileImage: mobileResult.secure_url,
    });

    res.status(201).json(banner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create banner" });
  }
};

export const getBannersHandler = async (req: Request, res: Response) => {
  try {
    const business = await prisma.business.findFirst(); // public route, no auth context
    if (!business) return res.status(404).json({ message: "Business not found" });

    const banners = await getBanners(business.id);
    res.status(200).json(banners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get banners" });
  }
};

export const getBannerByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const businessId = req.user!.businessId;
    const banner = await getBannerById(Number(id), businessId);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    res.status(200).json(banner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get banner" });
  }
};

export const updateBannerHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await updateBanner(Number(id), req.user!.businessId, req.body);
    res.status(200).json(banner);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Banner not found" });
  }
};

export const deleteBannerHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteBanner(Number(id), req.user!.businessId);
    res.status(200).json({ message: "Banner deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Banner not found" });
  }
};