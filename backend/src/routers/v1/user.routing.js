const router = require('express').Router();
const middlewares = require('../../middlewares');
const UserController = require('../../controllers/user.controller');

router.get('/nfc-check-in', middlewares.ErrorMiddleware.asyncHandler(
    UserController.nfcCheckIn
));

router.use(middlewares.ErrorMiddleware.asyncHandler(
    middlewares.AuthMiddleware.authentication(['admin', 'user'])
));

router.get('/get-tracking-time', middlewares.ErrorMiddleware.asyncHandler(
    UserController.getTrackingTime
));

module.exports = router;