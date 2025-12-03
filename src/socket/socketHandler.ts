// socket/socketHandler.ts
import { Server, Socket } from "socket.io";
// import { RedisClientType } from "redis";
import { subscriber } from "../redisClient.js";

interface EventData {
  type: string;
  data?: any;
  targetUserId?: string;
}

export default function socketHandler(io: Server) {
  subscriber.subscribe("events", (message) => {
    try {
      const event: EventData = JSON.parse(message);
      console.log("📢 Event received:", event);

      switch (event.type) {
        case "comment.added":
          io.emit("comment.added", event.data);
          break;

        case "post.liked":
          io.emit("post.liked", event.data);
          break;
        case "post.unliked":
          io.emit("post.unliked", event.data);
          break;

        case "post.created":
          io.emit("post.created", event.data);
          break;

        case "comment.notify":
          console.log("emit comment.notify", event);
          if (event.data.post) {
            console.log("emit comment.notify 333333", event.data.post.user);
            io.to(event.data.post.user).emit("comment.notify", event);
          }
          break;

        case "order.create.notify":
          console.log("emit order.create.notify", event);
          if (event.data) {
            console.log("order notifi", event.data);
            io.to(event.data.user).emit("order.create.notify", event);
            io.to("superadmin").emit("order.create.notify", event);
          }
          break;

        case "sendMessage":
          console.log("emit sendMessage data", event.data);
          if (event.data?.toUser) {
            io.to(event.data.toUser).emit("sendMessage", event.data);
          }
          break;

        default:
          console.warn("⚠️ Unknown event type:", event.type);
      }
    } catch (err) {
      console.error("❌ Failed to parse event message:", message, err);
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("join", (roomId: string) => {
      socket.join(roomId);
      console.log(`👤 User ${roomId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}
