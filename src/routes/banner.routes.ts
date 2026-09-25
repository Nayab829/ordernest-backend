import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { upload } from "../middlewares/upload";
import {
  createBannerHandler,
  deleteBannerHandler,
  getBannerByIdHandler,
  getBannersHandler,
  updateBannerHandler,
} from "../controllers/banner.controller";

const router = Router();

const bannerUploadMiddleware = upload.fields([
  { name: "desktopImage", maxCount: 1 },
  { name: "mobileImage", maxCount: 1 },
]);

/**
 * @swagger
 * /banners:
 *   post:
 *     summary: Create a new banner with desktop and mobile images
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Summer Sale 2026"
 *               desktopImage:
 *                 type: string
 *                 format: binary
 *                 description: Desktop banner image file
 *               mobileImage:
 *                 type: string
 *                 format: binary
 *                 description: Mobile/mvl banner image file
 *               desktopImageUrl:
 *                 type: string
 *                 example: "https://res.cloudinary.com/.../desktop.jpg"
 *               mobileImageUrl:
 *                 type: string
 *                 example: "https://res.cloudinary.com/.../mobile.jpg"
 *               link:
 *                 type: string
 *                 example: "https://example.com/promo"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Banner created successfully
 *       400:
 *         description: Missing required fields (title, desktop image, mobile image)
 */
router.post("/", authMiddleware, bannerUploadMiddleware, createBannerHandler);

/**
 * @swagger
 * /banners:
 *   get:
 *     summary: Get all banners for the logged-in business
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of banners
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getBannersHandler);

/**
 * @swagger
 * /banners/{id}:
 *   get:
 *     summary: Get a single banner by ID
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Banner found
 *       404:
 *         description: Banner not found
 */
router.get("/:id", authMiddleware, getBannerByIdHandler);

/**
 * @swagger
 * /banners/{id}:
 *   put:
 *     summary: Update a banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               desktopImage:
 *                 type: string
 *                 format: binary
 *               mobileImage:
 *                 type: string
 *                 format: binary
 *               desktopImageUrl:
 *                 type: string
 *               mobileImageUrl:
 *                 type: string
 *               link:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       404:
 *         description: Banner not found
 */
router.put("/:id", authMiddleware, bannerUploadMiddleware, updateBannerHandler);

/**
 * @swagger
 * /banners/{id}:
 *   delete:
 *     summary: Delete a banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 */
router.delete("/:id", authMiddleware, deleteBannerHandler);

export default router;
