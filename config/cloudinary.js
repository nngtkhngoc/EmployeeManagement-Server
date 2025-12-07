import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
// Cloudinary config - hỗ trợ cả CLOUDINARY_URL và config riêng

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
