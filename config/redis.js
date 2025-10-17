import { createClient } from "redis";
import dotenv from "dotenv";

let redisClient;
dotenv.config();

async function connectRedis() {
  if (redisClient) return redisClient;

  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      reconnectStrategy: (retries) => {
        if (retries > 5) {
          console.error("❌ Redis reconnect failed after 5 attempts.");
          return new Error("Redis reconnect failed");
        }
        console.warn(`Redis reconnect attempt #${retries}`);
        return Math.min(retries * 500, 5000);
      },
      connectTimeout: 8000,
    },
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD,
  });

  redisClient.on("connect", () => console.log("Connected to Redis Cloud"));

  redisClient.on("reconnecting", () => console.log("Reconnecting to Redis..."));

  redisClient.on("error", (err) => console.error("Redis Error:", err.message));

  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Redis initial connection failed:", err.message);
  }

  return redisClient;
}

export default await connectRedis();
