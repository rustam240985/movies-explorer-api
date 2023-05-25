const Movie = require('../models/movie');
const DelMovieError = require('../errors/delete-movie-err');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-error');

const errorDataNull = new Error('Карточка по указанному _id не найдена.');
errorDataNull.name = 'NullError';

const createMovie = (req, res, next) => {
  const { _id } = req.user;
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: _id,
  })
    .then((movie) => {
      movie.populate('owner').then((moviePop) => res.send(moviePop));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const { _id: ownerId } = req.user;

  Movie.findById({ _id: movieId })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Карточка с таким _id не найдена.');
      }
      if (movie.owner.toString() !== ownerId) {
        throw new DelMovieError('Можно удалять только собственные посты');
      }
      movie.deleteOne().then(() => {
        res.send({ message: 'Пост удален' });
      })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
