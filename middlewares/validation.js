const { celebrate, Joi } = require('celebrate');
const messages = require('../errors/messages');

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/[a-z0-9]+([\w]+\.)*([\w]+-)*([\w])*([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+|([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+/)
      .message(messages.emailIsNodValid),
    password: Joi.string().min(6).pattern(/\S+/),
  }),
});

const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(/[a-z0-9]+([\w]+\.)*([\w]+-)*([\w])*([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+|([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+/),
    password: Joi.string().min(6).pattern(/\S+/),
  }),
});

const validateCreateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().pattern(/(https?:\/\/)(www\.)?[a-z0-9]((\.\w)|([a-z0-9-_]))*\.([a-z]\/?){2,}(\w+\/?)*(:[1-9]\d{1,3}\/?)*|(https?:\/\/)(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(:[1-9]\d{2,3})?(\/[\w]*)*\/?#?/),
    image: Joi.string().required().pattern(/(https?:\/\/)(www\.)?[a-z0-9]((\.\w)|([a-z0-9-_]))*\.([a-z]\/?){2,}(\w+\/?)*(:[1-9]\d{1,3}\/?)*|(https?:\/\/)(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(:[1-9]\d{2,3})?(\/[\w]*)*\/?#?/),
  }),
});

const validateDeleteArticle = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex(),
  }),
});

module.exports = {
  validateSignIn, validateSignUp, validateCreateArticle, validateDeleteArticle,
};
