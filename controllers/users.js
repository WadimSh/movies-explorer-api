const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const InvalidRequest = require('../errors/InvalidRequest');
const IncorrectData = require('../errors/IncorrectData');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new IncorrectData('Передан неверный логин или пароль.'));
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.status(200)
      .send({
        data: {
          name, email,
        },
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidRequest('Переданы некорректные данные.'));
        return;
      }
      if (err.code === 11000) {
        next(new Conflict('Пользователь с указаным Email уже существует.'));
        return;
      }
      next(err);
    });
};

module.exports = {
  login, createUser,
};
