import { Router } from 'express';
import { createPost, getPosts } from '../controllers/post.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router = Router();
router.post('/', authMiddleware, createPost);
router.get('/', getPosts);
export default router;
