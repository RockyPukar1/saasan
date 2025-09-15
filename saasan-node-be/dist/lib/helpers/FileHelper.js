"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHelper = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const path_1 = __importDefault(require("path"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
class FileHelper {
    static async deleteFile(publicId) {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
}
exports.FileHelper = FileHelper;
_a = FileHelper;
FileHelper.storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        const folder = file.fieldname === "evidence" ? "evidence" : "profiles";
        return {
            folder: `saasan/${folder}`,
            allowed_formats: ["jpg", "png", "pdf", "mp4", "mp3"],
            resource_type: "auto",
        };
    },
});
FileHelper.upload = (0, multer_1.default)({
    storage: _a.storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|mp4|mp3|doc|docx/;
        const extName = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extName) {
            return cb(null, true);
        }
        cb(new Error("Invalid file type"));
    },
});
