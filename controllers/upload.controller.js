/**
 * @file Controller for POST /upload: returns the Cloudinary URL of an image
 * that upload.middleware already uploaded.
 */

/**
 * Responds with the uploaded image's URL, to be saved as a product's imageUrl.
 * @param {import('express').Request} req - req.file is set by multer (upload.single('imageUrl')).
 * @param {import('express').Response} res - 200 with { imageUrl }.
 * @param {import('express').NextFunction} next - Receives errors (400 when no file was sent).
 */
const uploadImageController = (req, res, next) => {
    // Multer puts the uploaded file in req.file
    if (!req.file) {
        const error = new Error("לא צורף קובץ לבקשה");
        error.status = 400;
        error.type = "bad_request";
        return next(error);
    }
    // Cloudinary's URL of the uploaded image
    const imageUrl = req.file.path;
    return res.status(200).json({ imageUrl: imageUrl });
};
export default uploadImageController;