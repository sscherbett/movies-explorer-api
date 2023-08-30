const { CastError } = require('mongoose').Error;
const Movie = require('../models/movie.js');
const {
  ERROR_CODE_OK,
  ERROR_CODE_CREATED,
} = require('../utils/constants');
const BadRequestError = require('../errors/bad-requesr-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getAllMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({});
    res.status(ERROR_CODE_OK).send(movie);
  } catch (err) {
    next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({
      owner: req.user._id,
      ...req.body,
    });
    res.status(ERROR_CODE_CREATED).send(movie);
  } catch (err) {
    next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      throw new NotFoundError('Фильм, с указанным _id, не найден');
    }

    if (req.user._id === movie.owner.toString()) {
      await Movie.deleteOne(movie);
      res.status(ERROR_CODE_OK).send({
        message: 'Фильм удален',
      });
    } else {
      throw new ForbiddenError('Отсутствуют права для удаления фильма');
    }
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError('Передан некорректный _id фильма'));
      return;
    }
    next(err);
  }
};

module.exports = {
  getAllMovies,
  createMovie,
  deleteMovie,
};
