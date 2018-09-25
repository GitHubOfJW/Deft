const express = require('express');
const router = express.Router()

// 引入控制器
const controller = require('../controllers/adminManager/AdminController');

// 引入路由配置文件
const { adminApi, adminPage } = require('../configure/routerConfig')


router.post(adminApi.adminList.path, controller.adminList)

router.get(adminPage.adminList.path, controller.adminListPage);

module.exports =  router;