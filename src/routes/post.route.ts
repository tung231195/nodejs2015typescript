import { Router } from 'express';
import { createPost, getPosts } from '../controllers/post.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = Router();
router.post('/', authMiddleware, createPost);
router.get('/', getPosts);
export default router;
