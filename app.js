require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');

const rateLimiter = require('./middlewares/rateLimit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes/index');

const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cors());

app.use(requestLogger);

app.use(rateLimiter);

app.use(helmet());

app.use(express.json());

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
