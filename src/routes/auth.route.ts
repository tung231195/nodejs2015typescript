import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  google,
  facebookCallback,
  resetPassword,
  forgotPassword,
} from "../controllers/auth.controller.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/google", google);
router.get("/facebook/callback", facebookCallback);
export default router;
