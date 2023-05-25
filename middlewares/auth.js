const jwt = require('jsonwebtoken');
const JwtError = require('../errors/jwt-error');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  let payload;

  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new JwtError('Необходима авторизация');
    }
    const extractBearerToken = (header) => header.replace('Bearer ', '');
    const token = extractBearerToken(authorization);

    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new JwtError('Ошибка авторизации'));
  }
  req.user = payload;

  next();
};
