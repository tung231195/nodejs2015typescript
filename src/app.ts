import express from 'express';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import postRoutes from './routes/post.route';
import commentRoutes from './routes/comment.route';
import likeRoutes from './routes/like.route';

const app = express();
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

export default app;
