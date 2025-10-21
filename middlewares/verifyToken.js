import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import { verifyRefreshToken } from "./verifyRefreshToken.js";

export async function verifyToken(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken)
      return res.status(401).json({ message: "Access token missing" });

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded.data;
      return next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        if (!refreshToken)
          return res.status(401).json({ message: "Refresh token missing" });

        const userData = await verifyRefreshToken(refreshToken);
        if (!userData)
          return res.status(403).json({ message: "Invalid refresh token" });

        const { id, role } = userData;

        const newAccessToken = jwt.sign(
          { data: { id, role } },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "5m" }
        );

        const newRefreshToken = jwt.sign(
          { data: { id, role } },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        await redis.del(`refresh:employee:${id}:${refreshToken}`);
        await redis.set(
          `refresh:employee:${id}:${newRefreshToken}`,
          "valid",
          "EX",
          7 * 24 * 60 * 60
        );

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 5 * 60 * 1000,
        });

        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        req.user = { id, role };
        return next();
      }

      return res.status(401).json({ message: "Invalid access token" });
    }
  } catch (error) {
    console.error("verifyToken error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
