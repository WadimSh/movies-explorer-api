const Movie = require('../models/movie');

const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');
const InvalidRequest = require('../errors/InvalidRequest');
const ProhibitedAction = require('../errors/ProhibitedAction');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      throw new NotFound(err.message);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ owner, ...req.body })
    .then((movie) => {
      res.status(201).send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidRequest(err.message);
      } else if (err.code === 11000) {
        throw new Conflict(err.message);
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Запрашиваемый ресурс не найден');
      }
      if (movie.owner.toString() !== owner) {
        throw new ProhibitedAction('Нет доступа к удалению фильма');
      } else {
        Movie.findByIdAndDelete(movieId)
          .then((deletedMovie) => {
            res.status(200).send({ data: deletedMovie });
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
