import { Router } from "express";
import { loginHandler, signupHandler } from "../controllers/auth.controller";

const router = Router();

router.post("/auth/signup", signupHandler);
router.post("/auth/login", loginHandler);
export default router;
