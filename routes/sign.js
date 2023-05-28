const signRouter = require('express').Router();
const { validateCreateUser, validateLogin } = require('../middlewares/validate-req-user');
const { createUser, login } = require('../controllers/users');

signRouter.post('/signin', validateLogin, login);
signRouter.post('/signup', validateCreateUser, createUser);

module.exports = signRouter;
