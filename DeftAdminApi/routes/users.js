const router = require('koa-router')()
const controller =  require('../controllers/UserController')

router.prefix('/user')
router.post('/login', controller.login)

module.exports = router
