
/**
 *  注意配置文件中的控制器名称Key要保持一致 
 *  adminPage adminApi controllers 中的所有控制器名称key要保持一致
 *  具体功能路由配置重的 method 要与控制器中的方法名一致
 */

const PATCH  = 'patch'
const DELETE = 'delete'
const POST = 'post'
const GET = 'get'


const adminManager = require('./routerConfig/AdminManager')


// 导出
module.exports = {
  adminApi:{
    ...adminManager.adminApi
  },
  adminPage:{
    ...adminManager.adminPage
  },
  requestType:{
    POST,
    PATCH,
    DELETE,
    GET
  }
}