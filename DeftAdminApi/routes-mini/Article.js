const router = require('koa-router')()
const Article = require('../controllers-mini/ArticleController')

// 上传图片
// router.post('/upload/image', upload.single('file'), Index.upload)

router.prefix('/mini')
router.get('/article/articles', Article.list)
router.get('/article/detail', Article.detail)
router.put('/article/read/:id', Article.read)

module.exports = router