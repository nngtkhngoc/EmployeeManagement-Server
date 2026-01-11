import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import dotenv from "dotenv";
dotenv.config();

export async function generateAccessTokenAndRefreshToken(employeeData) {
  console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
  console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);
  const accessToken = jwt.sign(
    { data: { id: employeeData.id, role: employeeData.role } },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  const refreshToken = jwt.sign(
    { data: { id: employeeData.id, role: employeeData.role } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  await redis.set(
    `refresh:employee:${employeeData.id}:${refreshToken}`,
    "valid",
    "EX",
    7 * 24 * 60 * 60
  );

  return { accessToken, refreshToken };
}
