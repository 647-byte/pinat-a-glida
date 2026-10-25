/** Message sent to the client for unexpected server errors (status 500 and above). */
const SERVER_ERROR_MESSAGE = "אירעה שגיאה בשרת, נסו שוב מאוחר יותר";

/**
 * Express error handler: sends every error as { success: false, type, message }.
 * - Multer's file size error becomes a 400 with a Hebrew message.
 * - Unexpected errors (500 and above) are logged with their full details on
 *   the server, and the client gets a general Hebrew message, so technical
 *   details (e.g. from MongoDB or Cloudinary) are never exposed.
 * @param {Error & { status?: number, type?: string, code?: string }} err - The error.
 * @param {import('express').Request} req - The request.
 * @param {import('express').Response} res - The response.
 * @param {import('express').NextFunction} next - Required by Express to detect an error handler.
 */
const errorHandler = (err, req, res, next) => {
    let { status = 500, type = 'server error', message } = err;
    if (err.code === "LIMIT_FILE_SIZE") {
        status = 400;
        type = "bad_request";
        message = "הקובץ גדול מדי. המשקל המקסימלי המותר להעלאה הוא 5MB.";
    }
    if (status >= 500) {
        console.error(`[${req.method} ${req.originalUrl}]`, err);
        message = SERVER_ERROR_MESSAGE;
    }
    res.status(status).json({
        success: false,
        type: type,
        message: message
    });
};
export default errorHandler;