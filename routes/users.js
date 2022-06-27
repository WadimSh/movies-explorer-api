const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  findAuthorizationUser,
  updateUser,
} = require('../controllers/users');

userRouter.get('/me', findAuthorizationUser);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = userRouter;
