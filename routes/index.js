const router = require('express').Router();
const { signInValidator, signUpValidator } = require('../middlewares/validators');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFound = require('../errors/NotFound');

router.post('/signin', signInValidator, login);

router.post('/signup', signUpValidator, createUser);

router.use('/users', auth, userRouter);

router.use('/movies', auth, movieRouter);

router.use('*', auth, (req, res, next) => {
  next(new NotFound('Страница с таким url не найдена.'));
});

module.exports = router;
