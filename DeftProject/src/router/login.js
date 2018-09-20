// 首页路由
const express = require('express');
const router = express.Router();

const controller = require('../controllers/LoginController');

// 引入路由配置文件
const { adminApi, adminPage } = require('../configure/routerConfig')

// 跳转到首页
router.get(adminPage.login.path,controller.loginPage);
router.get(adminPage.logout.path,controller.logoutPage)


router.post(adminApi.login.path,controller.memberLogin)

// 导出
module.exports = router;