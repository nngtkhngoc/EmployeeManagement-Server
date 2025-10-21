import jwt from "jsonwebtoken";
import redis from "../config/redis.js";

export async function generateAccessTokenAndRefreshToken(employeeData) {
  const accessToken = jwt.sign(
    { data: { id: employeeData.id, role: employeeData.role } },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m",
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
