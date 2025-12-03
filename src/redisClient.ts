// src/redis/redisClient.ts
import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";
import { isDocker } from "./util";

dotenv.config();

//const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
//const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";
const is_docker = isDocker();

let REDIS_URL;
if (is_docker) {
  REDIS_URL = "redis://redis:6379";
} else {
  REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
}
console.log("check is docker", is_docker, REDIS_URL);
//const REDIS_URL = "redis://red-d4debnali9vc73cg1m80:6379";

// 🟢 Publisher (dùng để gửi sự kiện)
export const publisher: RedisClientType = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy(retries) {
      console.log("🔁 Redis reconnect attempt:", retries);
      return Math.min(retries * 100, 3000); // retry after 0.1s → 3s
    },
  },
});

// 🔵 Subscriber (dùng để nhận sự kiện)
export const subscriber: RedisClientType = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy(retries) {
      console.log("🔁 Redis reconnect s attempt:", retries);
      return Math.min(retries * 100, 3000);
    },
  },
});

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
