const router = require('express').Router();
const middlewares = require('../../middlewares');
const UserController = require('../../controllers/user.controller');

router.get('/nfc-check-in', middlewares.ErrorMiddleware.asyncHandler(
    UserController.nfcCheckIn
));

module.exports = router;