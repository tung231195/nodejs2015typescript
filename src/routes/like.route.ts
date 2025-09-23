import { Router } from 'express';
import { likePost, unlikePost } from '../controllers/like.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = Router();
router.post('/', authMiddleware, likePost);
router.delete('/', authMiddleware, unlikePost);
export default router;
