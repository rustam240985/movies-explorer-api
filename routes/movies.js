const moviesRouter = require('express').Router();
const { ...movies } = require('../controllers/movies');
const { validateCreateMovie, validateIdMovie } = require('../middlewares/validate-req-movie');

moviesRouter.get('/', movies.getMovies);
moviesRouter.delete('/:movieId', validateIdMovie, movies.deleteMovie);
moviesRouter.post('/', validateCreateMovie, movies.createMovie);

module.exports = moviesRouter;
