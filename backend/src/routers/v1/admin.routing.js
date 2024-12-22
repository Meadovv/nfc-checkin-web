const router = require('express').Router();
const middlewares = require('../../middlewares');
const AdminController = require('../../controllers/admin.controller');
const config = require('../../.configs');
const constants = require('../../constants');

if(config.env === constants.appMode.DEV) {
    router.post('/create-super-user', middlewares.ErrorMiddleware.asyncHandler(
        AdminController.createSuperUser
    ));
}

router.use(middlewares.ErrorMiddleware.asyncHandler(
    middlewares.AuthMiddleware.authentication(['admin'])
));

/// GET

router.get('/get-users', middlewares.ErrorMiddleware.asyncHandler(
    AdminController.getUsers
));

router.get('/get-gates', middlewares.ErrorMiddleware.asyncHandler(
    AdminController.getGates
));

/// POST

router.post('/update-forbidden-information', middlewares.ErrorMiddleware.asyncHandler(
    AdminController.updateForbiddenInformation
));

router.post('/create-user', middlewares.ErrorMiddleware.asyncHandler(
    AdminController.createUser
));

router.post('/create-gate', middlewares.ErrorMiddleware.asyncHandler(
    AdminController.createGate
));

router.post('/update-gate', middlewares.ErrorMiddleware.asyncHandler(
    AdminController.updateGate
));

router.post('/switch-user-activation', middlewares.ErrorMiddleware.asyncHandler(
    AdminController.switchUserActivation
));

router.post('/switch-gate-activation', middlewares.ErrorMiddleware.asyncHandler(
    AdminController.switchGateActivation
));

module.exports = router;