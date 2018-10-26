
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
  ArticleController:{
    articleList:{
      path:'/article/list',
      desc:'管理员列表',
      method:'articleListPage',
      type:GET,
      selected:false
    },
    articleAdd:{
      path:'/article/add',
      desc:'添加管理员',
      method:'articleAddPage',
      type:GET,
      selected:false
    },
    articleEdit:{
      path:'/article/edit/:id',
      desc:'编辑管理员',
      method:'articleEditPage',
      type:GET,
      selected:false
    }
  }
}

// 调用api接口的路由
const adminApi = {
  ArticleController:{
    articleList:{
      path:'/api/article/list',
      desc:'管理员列表请求',
      method:'articleList',
      type:GET,
      selected:false,
    },
    ArticleAdd:{
      path:'/api/article/add',
      desc:'添加管理员',
      method:'articleAdd',
      type:POST,
      selected:false
    },
    articleEdit:{
      path:'/api/article/edit/:id',
      desc:'添加管理员',
      method:'articleEdit',
      type:POST,
      selected:false
    },
    articleStatus:{
      path:'/api/article/status/:id',
      desc:'启用/禁用管理员',
      method:'articleUpdate',
      type:POST,
      selected:false,
    },
    articleDelete:{
      path:'/api/article/delete',
      desc:'删除管理员',
      method:'articleDelete',
      type:POST,
      selected:false,
    },
    // articleRemove:{
    //   path:'/api/article/remove',
    //   desc:'彻底删除管理员',
    //   method:'articleRemove',
    //   type:POST,
    //   selected:false
    // },
  }
}


// 导出
module.exports = {
  adminApi,
  adminPage
}