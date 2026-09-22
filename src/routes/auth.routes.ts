import { Router } from "express";
import { loginHandler, signupHandler } from "../controllers/auth.controller";

const router = Router();

router.post("/register", signupHandler);
router.post("/login", loginHandler);
export default router;
