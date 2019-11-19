const router = require('koa-router')()
const upload =  require('../utils/upload')
const Banner = require('../controllers/BannerController')

router.prefix('/banner')
router.get('/list', Banner.list)
router.post('/add', Banner.create)
router.put('/edit/:id', Banner.update)
router.delete('/delete/:id', Banner.delete)
router.put('/recover/:id', Banner.recover)

module.exports = router