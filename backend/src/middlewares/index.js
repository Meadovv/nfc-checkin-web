const AuthMiddleware = require('./auth.middleware');
const IPMiddleware = require('./ip.middleware');
const ErrorMiddleware = require('./error.middleware');

const middlewares = {
    AuthMiddleware,
    IPMiddleware,
    ErrorMiddleware
}

module.exports = middlewares;