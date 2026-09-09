// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import { login, signup } from "../services/auth.service";

export async function signupHandler(req: Request, res: Response) {
  try {
    const { email, password, businessName } = req.body;

    if (!email || !password || !businessName) {
      return res.status(400).json({
        error: "email, password, and businessName are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }

    const result = await signup({ email, password, businessName });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : "Signup failed",
    });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "email and password are required",
      });
    }

    const result = await login({ email, password });
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({
      error: err instanceof Error ? err.message : "Login failed",
    });
  }
}
