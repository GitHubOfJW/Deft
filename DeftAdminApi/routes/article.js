const router = require('koa-router')()
const controller =  require('../controllers/ArticleController')

router.prefix('/article')
router.get('/list', controller.articleList)
router.post('/add', controller.articleCreated)
router.put('/edit/:id', controller.articleEdit)
router.delete('/delete/:id', controller.articleDelete)
router.put('/recover/:id', controller.articleRecover)
router.get('/detail/:id', controller.articleDetail)

router.get('/cate/parentCates', controller.cateParentList)
router.get('/cate/cates', controller.allCates)
router.get('/cate/list', controller.cateList)
router.post('/cate/add', controller.cateCreated)
router.put('/cate/edit/:id', controller.cateEdit)
router.delete('/cate/delete/:id', controller.cateDelete)
router.put('/cate/recover/:id', controller.cateRecover)

router.get('/label/labels', controller.alllabels)
router.get('/label/list', controller.labelList)
router.post('/label/add', controller.labelCreated)
router.put('/label/edit/:id', controller.labelEdit)
router.delete('/label/delete/:id', controller.labelDelete)
router.put('/label/recover/:id', controller.labelRecover)

module.exports = router
