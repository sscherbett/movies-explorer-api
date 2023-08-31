const moviesRouter = require('express').Router();
const {
  getAllUserMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { createMovieValidation, movieIdValidation } = require('../middlewares/validation');

moviesRouter.get('/', getAllUserMovies);
moviesRouter.post('/', createMovieValidation, createMovie);
moviesRouter.delete('/:movieId', movieIdValidation, deleteMovie);

module.exports = moviesRouter;
