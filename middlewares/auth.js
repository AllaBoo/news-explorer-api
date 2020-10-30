const jwt = require('jsonwebtoken');
const { ErrorUnauthorized } = require('../errors');
const messages = require('../errors/messages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new ErrorUnauthorized(messages.unauthorized);
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new ErrorUnauthorized(messages.unauthorized);
  }
  req.user = payload;
  return next();
};
