import { Router } from "express";
import {
  createPost,
  deletePostById,
  getPosts,
  getPost,
  updatePost,
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = Router();
router.post("/", authMiddleware, createPost);
router.get("/", getPosts);
router.put("/:id", updatePost);
router.get("/:id", getPost);
router.delete("/:id", deletePostById);
export default router;
