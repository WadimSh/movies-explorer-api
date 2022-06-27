const express = require('express');
const mongoose = require('mongoose');
//const { celebrate, Joi, errors } = require('celebrate');

const cors = require('cors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());

app.use(cors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
