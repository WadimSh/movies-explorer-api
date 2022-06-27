const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFound = require('../errors/NotFound');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use('/users', auth, userRouter);

router.use('/movies', auth, movieRouter);

router.use('*', auth, (req, res, next) => {
  next(new NotFound('Страница с таким url не найдена.'));
});

module.exports = router;
