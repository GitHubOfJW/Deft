const express = require('express');
const router = express.Router()
 

// 引入路由配置文件
const { adminApi, adminPage ,requestType} = require('../configure/routerConfig')

// 执行功能的控制器
const controllers = {
  LoginController:require('../controllers/LoginController'),
  IndexController:require('../controllers/IndexController'),
  AdminController:require('../controllers/adminManager/AdminController'),
  CateController:require('../controllers/adminManager/CateController'),
  AuthController:require('../controllers/adminManager/AuthController'),
  RoleController:require('../controllers/adminManager/RoleController'),
  ArticleCateController:require('../controllers/cateManager/ArticleCateController'),
  ArticleController:require('../controllers/articleManager/ArticleController'),
  ProductCateController:require('../controllers/cateManager/ProductCateController'),
  UploadController:require('../controllers/uploadManager/UploadController')
}

// console.log(controllers)

// 取出所有的控制器配置
const totalConfigControllers = [];
for(let controllerKey of Object.keys(adminPage)){
  console.log(controllerKey)
  totalConfigControllers.push({
    configController:adminPage[controllerKey],
    controllerKey:controllerKey
  })
}
for(let controllerKey of Object.keys(adminApi)){
  console.log(controllerKey)
  totalConfigControllers.push({
    configController:adminApi[controllerKey],
    controllerKey:controllerKey
  })
}

// 遍历设置路由
for(let {configController,controllerKey} of totalConfigControllers){
  for(let key of Object.keys(configController)){
    const type = configController[key].type;
    const method = configController[key].method;
    const path = configController[key].path;
    console.log(key,type,method,path);
    switch(type){
      case requestType.PATCH:
        router.patch(configController[key].path,controllers[controllerKey][method]);
        break
      case requestType.GET:
        router.get(configController[key].path,controllers[controllerKey][method]);
        break
      case requestType.POST:
        router.post(configController[key].path,controllers[controllerKey][method]);
        break;
      case requestType.DELETE:
        router.delete(configController[key].path,controllers[controllerKey][method]);
        break;
    }
  }
}


module.exports =  router;