const jwt = require('jsonwebtoken');

const IncorrectData = require('../errors/IncorrectData');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new IncorrectData('Необходима авторизация.'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new IncorrectData('Необходима авторизация.'));
  }

  req.user = payload;

  next();
  return true;
};
