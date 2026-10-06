import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        return cb(null, Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({ storage: storage });
export default upload;