
/**
 *  注意配置文件中的控制器名称Key要保持一致 
 *  adminPage adminApi controllers 中的所有控制器名称key要保持一致
 *  具体功能路由配置重的 method 要与控制器中的方法名一致
 */

// 所有的路由都配置导这里
const PATCH  = 'patch'
const DELETE = 'delete'
const POST = 'post'
const GET = 'get'

// 跳转页面的路由
const adminPage = {
  ArticleCateController:{
    cateList:{
      path:'/article/cate/list',
      desc:'文章分类列表',
      method:'cateListPage',
      type:GET,
      selected:false
    }
  }
}

// 调用api接口的路由
const adminApi = {
  ArticleCateController:{
    cateList:{
      path:'/api/article/cate/list',
      desc:'文章分类列表',
      method:'cateList',
      type:GET,
      selected:false,
    },
    cateAdd:{
      path:'/api/article/cate/add',
      desc:'添加文章分类',
      method:'cateAdd',
      type:POST,
      selected:false
    },
    cateEdit:{
      path:'/api/article/cate/edit/:id',
      desc:'修改文章分类',
      method:'cateUpdate',
      type:POST,
      selected:false
    },
    cateDelete:{
      path:'/api/article/cate/delete',
      desc:'删除文章分类',
      method:'cateDelete',
      type:POST,
      selected:false,
    },
    cateRemove:{
      path:'/api/article/cate/remove',
      desc:'彻底删除文章分类',
      method:'cateRemove',
      type:POST,
      selected:false
    },
  }
}


// 导出
module.exports = {
  adminApi,
  adminPage
}