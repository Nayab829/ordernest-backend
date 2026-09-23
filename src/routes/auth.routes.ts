import { Router } from "express";
import {
  getCurrentUserHandler,
  loginHandler,
  signupHandler,
} from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.post("/register", signupHandler);
router.post("/login", loginHandler);
router.get("/me", authMiddleware, getCurrentUserHandler);
export default router;
