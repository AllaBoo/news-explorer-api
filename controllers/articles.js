const Article = require('../models/article');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorForbidden = require('../errors/ErrorForbidden');
const ErrorBadRequest = require('../errors/ErrorBadRequest');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .populate('user')
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
        next(new ErrorBadRequest(`Данные не прошли проверку: ${err.message}`));
      }
      next(err);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id).select('owner')
    .orFail(new ErrorNotFound('Нет статьи с таким ID'))
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ErrorForbidden('Запрещено удаление статей других пользователей');
      }
      article.remove()
        .then(() => res.send({ message: 'Статья удалена' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Введён некорректный по форме ID статьи'));
      }
      next(err);
    });
};
