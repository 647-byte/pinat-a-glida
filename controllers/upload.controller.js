const uploadImageController = (req, res, next) => {
    // Multer שם את הקובץ שהועלה בתוך req.file
    if (!req.file) {
        const error = new Error("לא צורף קובץ לבקשה");
        error.status = 400;
        error.type = "bad_request";
        return next(error);
    }
    // בניית הנתיב לתמונה
    const imageUrl = req.file.path;
    // החזרת תשובה נקייה ללקוח
    return res.status(200).json({ imageUrl: imageUrl });
};
export default uploadImageController;