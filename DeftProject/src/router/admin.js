const express = require('express');
const router = express.Router()

// 引入控制器
const controller = require('../controllers/adminManager/AdminController');

// 引入路由配置文件
const { adminApi, adminPage } = require('../configure/routerConfig')


router.get(adminApi.adminList.path, controller.adminList)

router.get(adminPage.adminList.path, controller.adminListPage);

router.post(adminApi.adminDelete.path, controller.adminUpate);

router.post(adminApi.adminStatus.path, controller.adminUpate);

router.get(adminPage.adminAdd.path, controller.adminAddPage);

module.exports =  router;