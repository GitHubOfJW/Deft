const router = require('koa-router')()
const upload =  require('../utils/upload')
const Meta = require('../controllers/MetaController')

router.prefix('/meta')
router.get('/platforms', Meta.allPlatform)

module.exports = router