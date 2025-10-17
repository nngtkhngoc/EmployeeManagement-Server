import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { rateLimiter } from "./middlewares/rateLimiter.js";

dotenv.config();
const app = express();

app.use(cors({}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: process.env.COOKIE_KEY,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
);
app.use(rateLimiter);

const PORT = process.env.PORT || "5001";
app.listen(PORT, () => {
  console.log("Server is listening on port ", PORT);
});
