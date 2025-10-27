import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  google,
  facebookCallback,
} from "../controllers/auth.controller.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/google", google);
router.get("/facebook/callback", facebookCallback);
export default router;
