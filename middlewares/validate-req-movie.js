const { Joi, celebrate } = require('celebrate');
const { urlPattern } = require('../utils/constants');

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(urlPattern).required(),
    trailerLink: Joi.string().pattern(urlPattern).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().pattern(urlPattern).required(),
    movieId: Joi.number().required(),
  }),
});

const validateIdMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validateCreateMovie,
  validateIdMovie,
};
