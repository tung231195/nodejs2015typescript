import { Router } from "express";
import {
  createSlideshow,
  deleteSlideshowById,
  getSlideshows,
  getSlideshow,
  updateSlideshow,
} from "../controllers/slideshow.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = Router();
router.post("/", authMiddleware, createSlideshow);
router.get("/", getSlideshows);
router.put("/:id", updateSlideshow);
router.get("/:id", getSlideshow);
router.delete("/:id", deleteSlideshowById);
export default router;
