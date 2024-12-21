const router = require('express').Router();
const config = require('../.configs');
const {
    WELCOME
} = require('../core/response.core');
const v1Router = require('./v1');
const v2Router = require('./v2');
const middlewares = require('../middlewares');

// IP
router.use(middlewares.IPMiddleware.validateIP);

// Default GET
router.get('/', (req, res) => {
    return new WELCOME({
        message: 'Welcome to the Optimus API!',
    }).send(req, res);
})

// API Versioning
router.use('/api/v1', v1Router);
router.use('/api/v2', v2Router);

// Not Found Handler
router.use((_req, _res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

// Error Handler
router.use((error, _req, res, _next) => {
    let code = error.status || 500;
    let message = error.message || 'Internal Server Error';
    if(error.name === 'CastError') message = 'Invalid ID';

    return res.status(code).json({
        status: 'error',
        code,
        message,
        stack: config.env === 'dev' ? error.stack : undefined
    })
})

module.exports = router;