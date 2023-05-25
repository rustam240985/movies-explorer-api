const usersRouter = require('express').Router();
const { ...users } = require('../controllers/users');
const { validateUser } = require('../middlewares/validate-req-user');

usersRouter.get('/me', users.getCurrentUser);
usersRouter.patch('/me', validateUser, users.updateUser);

module.exports = usersRouter;
