const Article = require('../models/article');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorForbidden = require('../errors/ErrorForbidden');

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
    .catch(next);
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
    .catch(next);
};
