import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors({}));
app.use(morgan("dev"));

const PORT = process.env.PORT || "5001";
app.listen(PORT, () => {
  console.log("Server is listening on port ", PORT);
});
