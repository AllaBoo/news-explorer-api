const router = require('express').Router();
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const users = require('./users');
const articles = require('./articles');
const { createUser, login } = require('../controllers/users');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const auth = require('../middlewares/auth');
const { ErrorNotFound } = require('../errors');
const messages = require('../errors/messages');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(requestLogger);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(/[a-z0-9]+([\w]+\.)*([\w]+-)*([\w])*([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+|([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+/),
    password: Joi.string().min(6).pattern(/\S+/),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/[a-z0-9]+([\w]+\.)*([\w]+-)*([\w])*([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+|([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+/),
    password: Joi.string().min(6).pattern(/\S+/),
  }),
}), login);
router.use('/users', auth, users);
router.use('/articles', auth, articles);
router.use('*', (req, res, next) => {
  next(new ErrorNotFound(messages.pageNotFound));
});

router.use(errorLogger);
router.use(errors());

module.exports = router;
