const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimiter = require('./middlewares/rateLimiter');
const router = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const { NODE_ENV, DATABASE_URL } = process.env;

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : 'mongodb://localhost:27017/news-db', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());
app.use(rateLimiter);
app.use(router);
app.use(errorHandler);
app.listen(PORT);
