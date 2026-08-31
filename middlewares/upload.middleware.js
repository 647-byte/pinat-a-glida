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
const uploadMiddleware = (filedName) => {
    return (req, res, next) => {
        //נדרש לעשות פונקציית callback כי כאשר העברנו לפונקציית מעטפת מה שאקספרס
        //  היה עושה באופן אוטומטי-העברה של req res כבר לא מועבר.
        upload.single(filedName)(req, res, (err) => {
            if (err)
                return next(err);
            if (req.file)
                req.body.imageUrl = `/uploads/${req.file.filename}`;
            next();
        });
    }
}
export default uploadMiddleware;