// 首页路由
const express = require('express');
const router = express.Router();

const controller = require('../controllers/IndexController');

// 引入路由配置文件
const { adminApi, adminPage } = require('../configure/routerConfig')

// 跳转到首页
router.get(adminPage.default.path,controller.index);
router.get(adminPage.index.path,controller.index);

router.get(adminPage.welcome.path,controller.welcome);


// 导出
module.exports = router;