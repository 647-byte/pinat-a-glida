import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "pinat-a-glida-uploads", // שם התיקייה שתופיע בענן
        allowed_formats: ["jpg", "png", "jpeg", "webp"], // אילו קבצים מותר להעלות
    },
});
const upload = multer({ storage: storage });
export default upload;