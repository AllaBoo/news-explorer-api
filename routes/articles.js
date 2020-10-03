const router = require('express').Router();
const { validateCreateArticle, validateDeleteArticle } = require('../middlewares/validation');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

router.get('/', getArticles);
router.post('/', validateCreateArticle, createArticle);
router.delete('/:id', validateDeleteArticle, deleteArticle);

module.exports = router;
