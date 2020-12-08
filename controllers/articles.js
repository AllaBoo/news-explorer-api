const Article = require('../models/article');
const { ErrorNotFound, ErrorForbidden, ErrorBadRequest } = require('../errors');
const messages = require('../errors/messages');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => { res.send({ data: articles }); })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.status(201).send({ data: article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      }
      next(err);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id).select('owner')
    .orFail(new ErrorNotFound(messages.articleNotFound))
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ErrorForbidden(messages.articleIsNotYour);
      }
      article.remove()
        .then(() => res.send({ message: 'Статья удалена' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest(messages.articleIdWrong));
      }
      next(err);
    });
};
