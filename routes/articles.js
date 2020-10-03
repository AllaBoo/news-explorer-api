const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

router.get('/', getArticles);
router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().pattern(/(https?:\/\/)(www\.)?[a-z0-9]((\.\w)|([a-z0-9-_]))*\.([a-z]\/?){2,}(\w+\/?)*(:[1-9]\d{1,3}\/?)*|(https?:\/\/)(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(:[1-9]\d{2,3})?(\/[\w]*)*\/?#?/),
    image: Joi.string().required().pattern(/(https?:\/\/)(www\.)?[a-z0-9]((\.\w)|([a-z0-9-_]))*\.([a-z]\/?){2,}(\w+\/?)*(:[1-9]\d{1,3}\/?)*|(https?:\/\/)(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(:[1-9]\d{2,3})?(\/[\w]*)*\/?#?/),
  }),
}), createArticle);
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex(),
  }),
}), deleteArticle);

module.exports = router;
