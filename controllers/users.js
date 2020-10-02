const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PasswordValidator = require('password-validator');
const User = require('../models/user');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorBadRequest = require('../errors/ErrorBadRequest');

const { NODE_ENV, JWT_SECRET } = process.env;

const passwordSchema = new PasswordValidator();
passwordSchema
  .is().min(6)
  .has().not()
  .spaces();

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      }))
      .then((user) => res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      }))
      .catch(next);
  } else return new ErrorBadRequest('Пароль должен быть более 6 символов и без пробелов');
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new ErrorNotFound('Нет пользователя с таким ID'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};
