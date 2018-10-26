
/**
 *  注意配置文件中的控制器名称Key要保持一致 
 *  articlePage articleApi controllers 中的所有控制器名称key要保持一致
 *  具体功能路由配置重的 method 要与控制器中的方法名一致
 */

// 所有的路由都配置导这里
const PATCH  = 'patch'
const DELETE = 'delete'
const POST = 'post'
const GET = 'get'

// 跳转页面的路由
const adminPage = {
  UploadController:{
  }
}

// 调用api接口的路由
const adminApi = {
  UploadController:{
    upload:{
      path:'/image/upload',
      desc:'图片上传',
      method:'upload',
      type:GET,
      selected:true
    }
  }
}


// 导出
module.exports = {
  adminApi,
  adminPage
}