const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PasswordValidator = require('password-validator');
const User = require('../models/user');
const { ErrorNotFound, ErrorBadRequest, ErrorConflict } = require('../errors');
const messages = require('../errors/messages');

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
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new ErrorBadRequest(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
        }
        if (err.code === 11000) {
          next(new ErrorConflict(messages.emailIsNotUnique));
        }
        next(err);
      });
  } return new ErrorBadRequest(messages.passwordIsNodValid);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new ErrorNotFound(messages.userNotFound))
    .then((user) => res.status(200).send({
      name: user.name,
      email: user.email,
    }))
    .catch(next);
};
