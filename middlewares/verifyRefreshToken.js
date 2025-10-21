import jwt from "jsonwebtoken";
import redis from "../config/redis.js";

export async function verifyRefreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const { id } = decoded.data;

    const isValid = await redis.get(`refresh:employee:${id}:${refreshToken}`);
    if (!isValid) return null;

    return decoded.data;
  } catch (error) {
    return null;
  }
}
