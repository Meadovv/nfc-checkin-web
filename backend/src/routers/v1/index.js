const router = require('express').Router();

const UserRouter = require('./user.routing');
const AdminRouter = require('./admin.routing');
const GlobalRouter = require('./global.routing');

router.use('/user', UserRouter);
router.use('/admin', AdminRouter);
router.use('/', GlobalRouter);


module.exports = router;