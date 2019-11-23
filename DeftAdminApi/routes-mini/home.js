const router = require('koa-router')()
const Home = require('../controllers-mini/HomeController')

// 上传图片
// router.post('/upload/image', upload.single('file'), Index.upload)

router.prefix('/mini')
router.get('/home/index', Home.home)
router.get('/home/mainCates', Home.mainMenus)
router.get('/home/subCates', Home.miniSubMenus)
router.get('/home/articles', Home.list)

module.exports = router