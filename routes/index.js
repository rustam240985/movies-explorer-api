const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');
const moviesRouter = require('./movies');
const usersRouter = require('./users');

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.all('/*', () => {
  throw new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса');
});

module.exports = router;
