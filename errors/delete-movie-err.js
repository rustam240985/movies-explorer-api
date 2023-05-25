const { ERROR_DEL_CODE } = require('../utils/constants');

class DelMovieError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_DEL_CODE;
  }
}

module.exports = DelMovieError;
