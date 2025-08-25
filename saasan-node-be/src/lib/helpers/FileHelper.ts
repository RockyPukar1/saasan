import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import path, { extname } from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class FileHelper {
  static storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const folder = file.fieldname === "evidence" ? "evidence" : "profiles";
      return {
        folder: `saasan/${folder}`,
        allowed_formats: ["jpg", "png", "pdf", "mp4", "mp3"],
        resource_type: "auto",
      };
    },
  });

  static upload = multer({
    storage: this.storage,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|pdf|mp4|mp3|doc|docx/;
      const extName = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = allowedTypes.test(file.mimetype);

      if (mimetype && extName) {
        return cb(null, true);
      }

      cb(new Error("Invalid file type"));
    },
  });

  static async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
