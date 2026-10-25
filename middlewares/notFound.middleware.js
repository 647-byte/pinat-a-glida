/**
 * @file Handles requests to paths that no route matches.
 */
/**
 * Passes a 404 error for the requested path to the error handler.
 * @param {import('express').Request} req - The request.
 * @param {import('express').Response} res - The response.
 * @param {import('express').NextFunction} next - Receives the 404 error.
 */
const pageNotFound = (req, res, next) => {
    const error = new Error(`הנתיב ${req.originalUrl} לא נמצא`);
    error.status = 404;
    error.type = "not_found";
    next(error);
};
export default pageNotFound;