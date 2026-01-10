import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true, // an toàn khi upload
});

export default cloudinary;
