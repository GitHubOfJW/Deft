const router = require('koa-router')()
const upload =  require('../utils/upload')
const Index = require('../controllers/IndexController')

// 上传图片
router.post('/upload/image', upload.single('file'), Index.upload)

router.get('/taskAction', Index.taskAction)

module.exports = router