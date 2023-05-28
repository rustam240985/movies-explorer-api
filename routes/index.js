const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');
const auth = require('../middlewares/auth');
const moviesRouter = require('./movies');
const signRouter = require('./sign');
const usersRouter = require('./users');

router.use(signRouter);
router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);

router.all('/*', () => {
  throw new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса');
});

module.exports = router;
