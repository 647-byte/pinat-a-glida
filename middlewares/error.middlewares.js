const errorHandler = (err, req, res, next) => {
    let { status = 500, type = 'server error', message } = err;
    if (err.code === "LIMIT_FILE_SIZE") {
        status = 400;
        type = "bad_request";
        message = "הקובץ גדול מדי. המשקל המקסימלי המותר להעלאה הוא 5MB.";
    }
    res.status(status).json({
        success: false,
        type: type,
        message: message
    })
}
export default errorHandler;