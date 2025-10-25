import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { routes } from "./routes/index.js";
import globalErrorHandler from "./common/globalErrorHandler.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
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
// app.use(rateLimiter);

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

routes(app);

app.use(globalErrorHandler);

const PORT = process.env.PORT || "5001";
app.listen(PORT, () => {
  console.log("Server is listening on port ", PORT);
});
