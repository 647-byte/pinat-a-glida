const pageNotFound = (req, res, next) => {
    const error = new Error(`הנתיב ${req.originalUrl} לא נמצא`);
    error.status = 404;
    error.type = "not_found";
    next(error);
};
export default pageNotFound;