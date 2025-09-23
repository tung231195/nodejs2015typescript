import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route";
import postRoutes from "./routes/post.route";
import commentRoutes from "./routes/comment.route";
import likeRoutes from "./routes/like.route";
import authRoutes from "./routes/auth.route";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
