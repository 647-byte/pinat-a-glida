const errorHandler = (err, req, res, next) => {
    const { status = 500, type = 'server error', message } = err;
    res.status(status).json({
        success: false,
        type: type,
        message: message
    })
}
export default errorHandler;