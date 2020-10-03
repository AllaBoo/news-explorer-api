const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const users = require('./routes/users');
const articles = require('./routes/articles');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/news-db', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(requestLogger);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(/[a-z0-9]+([\w]+\.)*([\w]+-)*([\w])*([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+|([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+/),
    password: Joi.string().min(6).pattern(/\S+/),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/[a-z0-9]+([\w]+\.)*([\w]+-)*([\w])*([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+|([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+/),
    password: Joi.string().min(6).pattern(/\S+/),
  }),
}), login);
app.use(auth);
app.use('/users', users);
app.use('/articles', articles);
app.use(errorLogger);
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.name === 'ValidationError') {
    return res.status(400).send(`Данные не прошли проверку: ${err.message}`);
  }
  if (err.code === 11000) {
    return res.status(409).send({ message: 'Конфликт данных: введённые данные уже используются' });
  }
  if (err.name === 'CastError') {
    return res.status(400).send({ message: 'Введён некорректный по форме ID' });
  }
  return res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT);
