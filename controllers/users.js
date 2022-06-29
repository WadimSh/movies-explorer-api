const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const InvalidRequest = require('../errors/InvalidRequest');
const IncorrectData = require('../errors/IncorrectData');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
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
      }
      if (err.code === 11000) {
        next(new Conflict('Пользователь с указаным Email уже существует.'));
      } else {
        next(err);
      }
    });
};

const findAuthorizationUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь не найден.'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequest('Нет такого пользователя.'));
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь с таким _id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InvalidRequest('Переданы некорректные данные.'));
      } else if (err.code === 11000) {
        next(new Conflict('Указанные данные уже используются.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  login, createUser, findAuthorizationUser, updateUser,
};
