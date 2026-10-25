/**
 * @file Multer middleware that uploads images straight to Cloudinary.
 * Only jpg, jpeg, png and webp files up to 5 MB are accepted.
 */
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "pinat-a-glida-uploads", // Folder name in Cloudinary
        allowed_formats: ["jpg", "png", "jpeg", "webp"], // Allowed image types
    },
});
const upload = multer(
    { storage: storage,
        limits: { 
        fileSize: 5 * 1024 * 1024 // 5 MB
    }}
);
export default upload;