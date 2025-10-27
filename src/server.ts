import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import likeRoutes from "./routes/like.route.js";
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import attributeRoutes from "./routes/attribute.route.js";
import productRoutes from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js";
import orderItemRoutes from "./routes/orderItem.route.js";
import paypalServiceRoutes from "./routes/order.service.route.js";
import paymentRoutes from "./routes/paypal.route.js";
import addresstRoutes from "./routes/address.route.js";
import paymentMethodRoutes from "./routes/payment.route.js";
import deliverytRoutes from "./routes/delivery.route.js";
import http from "http";
import path from "path";
import socketHandler from "./socket/socketHandler.js";
import { publisher } from "./redisClient.js";
import { Server } from "socket.io";
import cors from "cors";
dotenv.config();
connectDB();
const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));
app.use(express.json({ limit: "10mb" })); // 👈 tăng giới hạn JSON payload
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: [
      process.env.FRONTEND_ORIGIN || "http://localhost:3000",
      "https://ideographic-nonmodificative-alfonso.ngrok-free.dev",
    ], // domain frontend của bạn
    credentials: true, // nếu có dùng cookie / session
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/attributes", attributeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", orderItemRoutes);
app.use("/api/service", paypalServiceRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/address", addresstRoutes);
app.use("/api/delivery", deliverytRoutes);
app.use("/api/paymentmethod", paymentMethodRoutes);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_ORIGIN || "http://localhost:3000",
      "https://ideographic-nonmodificative-alfonso.ngrok-free.dev",
    ],
  },
});
// Truyền io + subscriber vào handler
socketHandler(io, publisher);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
