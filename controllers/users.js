const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-error');
const DuplicateKeyError = require('../errors/duplicate-key-error');
const {
  messageErrValidate, messageErrDuplicate, messageErrId, messageNullUser,
} = require('../utils/constants');

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.init()
      .then(() => User.create({
        name,
        email,
        password: hash,
      })))
    .then((newUser) => {
      res.send({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new DuplicateKeyError(messageErrDuplicate));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError(messageErrValidate));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(messageNullUser);
      }
      const {
        name,
        email,
      } = user;
      return res.send({
        name,
        email,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(messageErrId));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, email } = req.body;

  User.findByIdAndUpdate(_id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new DuplicateKeyError(messageErrDuplicate));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError(messageErrValidate));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
