const Movie = require('../models/movie');
const DelMovieError = require('../errors/delete-movie-err');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-error');
const {
  messageNullMovie, messageErrDelMovie, messageErrId, messageErrValidate, messageDelMovie,
} = require('../utils/constants');

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
      movie.populate('owner')
        .then((moviePop) => res.send(moviePop))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${messageErrValidate} фильма`));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  const { _id: ownerId } = req.user;

  Movie.find({ owner: ownerId })
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
        throw new NotFoundError(messageNullMovie);
      }
      if (movie.owner.toString() !== ownerId) {
        throw new DelMovieError(messageErrDelMovie);
      }
      movie.deleteOne().then(() => {
        res.send({ message: messageDelMovie });
      })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(`${messageErrId} фильма`));
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
