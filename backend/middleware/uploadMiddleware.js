import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

let uploadMiddleware;

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "blog-posts",
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "avif"],
    },
  });

  uploadMiddleware = multer({ storage });
  console.log("✓ Cloudinary storage configured");
} else {
  // Fallback to memory storage if Cloudinary env vars not set
  const storage = multer.memoryStorage();
  uploadMiddleware = multer({ storage });
  console.warn(
    "⚠ Cloudinary not configured — using memory storage (data will be lost on restart)",
  );
}

export default uploadMiddleware;