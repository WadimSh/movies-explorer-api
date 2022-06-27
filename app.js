const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');

const NotFound = require('./errors/NotFound');

const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());

app.use(requestLogger);

app.use(cors());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/users', auth, require('./routes/users'));

app.use('/movies', auth, require('./routes/movies'));

app.use('*', auth, (req, res, next) => {
  next(new NotFound('Страница с таким url не найдена.'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, _, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  res.status(500).send({ message: 'Ошибка по умолчанию.' });
  next();
});

app.listen(PORT);
