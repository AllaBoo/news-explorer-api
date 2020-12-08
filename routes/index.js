const router = require('express').Router();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const users = require('./users');
const articles = require('./articles');
const { createUser, login, logout } = require('../controllers/users');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const auth = require('../middlewares/auth');
const { ErrorNotFound, messages } = require('../errors');
const { validateSignUp, validateSignIn } = require('../middlewares/validation');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(requestLogger);
router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);
router.use('/signout', logout);
router.use('/users', auth, users);
router.use('/articles', auth, articles);
router.use('*', (req, res, next) => {
  next(new ErrorNotFound(messages.pageNotFound));
});

router.use(errorLogger);
router.use(errors());

module.exports = router;
