const moviesRouter = require('express').Router();
const {
  getAllMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { createMovieValidation, movieIdValidation } = require('../middlewares/validation');

moviesRouter.get('/', getAllMovies);
moviesRouter.post('/', createMovieValidation, createMovie);
moviesRouter.delete('/:movieId', movieIdValidation, deleteMovie);

module.exports = moviesRouter;
