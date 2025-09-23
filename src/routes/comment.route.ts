import { Router } from 'express';
import { createComment, getCommentsByPost } from '../controllers/comment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = Router();
router.post('/', authMiddleware, createComment);
router.get('/:postId', getCommentsByPost);
export default router;
