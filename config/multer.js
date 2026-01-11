import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "my_uploads", // thư mục trong Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp", "pdf"],
  },
});

const upload = multer({ storage });

// Memory storage for PDF extraction (to get buffer)
const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file PDF"), false);
    }
  },
});

export default upload;
export { uploadMemory };
