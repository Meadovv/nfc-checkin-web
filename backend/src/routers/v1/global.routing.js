const router = require('express').Router();
const middlewares = require('../../middlewares');
const GlobalController = require('../../controllers/global.controller');

router.post('/login', middlewares.ErrorMiddleware.asyncHandler(
    GlobalController.login
));

router.use(middlewares.ErrorMiddleware.asyncHandler(
    middlewares.AuthMiddleware.authentication()
));

router.get('/verify-token', middlewares.ErrorMiddleware.asyncHandler(
    GlobalController.verifyToken
));

module.exports = router;