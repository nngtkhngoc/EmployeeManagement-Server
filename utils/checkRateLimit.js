import connectRedis from "../config/redis.js";

const WINDOW_SIZE = process.env.WINDOW_SIZE;
const LIMIT = process.env.LIMIT_REQUESTS;
const redisClient = connectRedis;

export async function checkRateLimit(userId) {
  const now = Math.floor(Date.now() / 1000);
  const currWindow = Math.floor(now / WINDOW_SIZE); // window's index
  const prevWindow = currWindow - 1;

  const [currCount, prevCount] = await redisClient.mGet(
    `${userId}:${currentWindow}`,
    `${userId}:${prevWindow}`
  );

  const currentCnt = parseInt(currCount || "0");
  const previousCnt = parseInt(prevCount || "0");

  const elapsed = now % WINDOW_SIZE;
  const effectiveCnt = currentCnt + previousCnt * (1 - elapsed / WINDOW_SIZE);

  const allowed = effectiveCnt < LIMIT;

  if (allowed) {
    await redis.incr(`${userId}:${currentWindow}`);
    await redis.expire(`${userId}:${currentWindow}`, WINDOW_SIZE * 2); // auto_delete
  }

  return allowed;
}
