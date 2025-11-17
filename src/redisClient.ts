// src/redis/redisClient.ts
import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";

dotenv.config();

//const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const REDIS_URL = "redis://red-d4debnali9vc73cg1m80:6379";

// 🟢 Publisher (dùng để gửi sự kiện)
export const publisher: RedisClientType = createClient({ url: REDIS_URL });

// 🔵 Subscriber (dùng để nhận sự kiện)
export const subscriber: RedisClientType = createClient({ url: REDIS_URL });

// Bắt lỗi Redis
[publisher, subscriber].forEach((client) => {
  client.on("error", (err) => {
    console.error("❌ Redis error:", err.message);
  });
});

// Kết nối Redis
(async () => {
  try {
    await Promise.all([publisher.connect(), subscriber.connect()]);
    console.log("✅ Redis connected (publisher & subscriber)");
  } catch (err) {
    console.error("❌ Redis connect failed:", err);
  }
})();
