const jwt = require('jsonwebtoken');
const { ErrorUnauthorized } = require('../errors');
const messages = require('../errors/messages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorUnauthorized(messages.unauthorized);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new ErrorUnauthorized(messages.unauthorized);
  }
  req.user = payload;
  return next();
};
