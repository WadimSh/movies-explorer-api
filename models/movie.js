const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Не указана страна фильма'],
  },
  director: {
    type: String,
    required: [true, 'Не указан режиссер'],
  },
  duration: {
    type: Number,
    required: [true, 'Не указана длительность фильма'],
  },
  year: {
    type: String,
    required: [true, 'Не указан год выхода фильма'],
  },
  description: {
    type: String,
    required: [true, 'Нет описания фильма'],
  },
  image: {
    type: String,
    required: [true, 'Нет постера к фильму'],
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: 'Введён некорректный URL',
    },
  },
  trailer: {
    type: String,
    required: [true, 'Не указана ссылка на трейлер'],
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: 'Некорректная ссылка на трейлер',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Не указана ссылка на миниатюру постера'],
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: 'Некорректная ссылка на миниатюру постера',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Не указан пользователь сохранивший фильм'],
  },
  movieId: {
    type: Number,
    required: [true, 'Не указан идентификатор фильма'],
  },
  nameRU: {
    type: String,
    required: [true, 'Не указано название фильма на русском языке'],
  },
  nameEN: {
    type: String,
    required: [true, 'Не указано название фильма на английском языке'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
