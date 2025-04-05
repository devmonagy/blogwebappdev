// server/middleware/upload.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

/**
 * Factory function to create a multer upload middleware
 * for a specific Cloudinary folder.
 */
export const createUploadMiddleware = (folderName: string) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      return {
        folder: folderName,
        // 🔥 Let Cloudinary use the original format (including gif, jpg, png, webp, etc.)
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
      };
    },
  });

  return multer({ storage });
};
