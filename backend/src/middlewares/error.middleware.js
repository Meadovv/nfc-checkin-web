class ErrorMiddleware {
    static asyncHandler = fn => (req, res, next) =>
        Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = ErrorMiddleware;