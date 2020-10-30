const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('./middlewares/rateLimiter');
const router = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const corsOptions = {
  origin: [
    'news-explorer-praktikum.ru',
    'http://localhost:8080',
    'https://allaboo.github.io',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    'Content-Type',
    'origin',
    'x-access-token',
  ],
  credentials: true,
};
const { NODE_ENV, DATABASE_URL } = process.env;

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : 'mongodb://localhost:27017/news-db', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());
app.use('*', cors(corsOptions));
app.use(helmet());
app.use(rateLimiter);
app.use(router);
app.use(errorHandler);
app.listen(PORT);
