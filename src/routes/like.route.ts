import { Router } from 'express';
import { likePost, unlikePost } from '../controllers/like.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router = Router();
router.post('/', authMiddleware, likePost);
router.delete('/', authMiddleware, unlikePost);
export default router;
