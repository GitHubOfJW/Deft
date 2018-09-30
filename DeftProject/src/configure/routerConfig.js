
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
  LoginController:{
    login:{
      path:'/login',
      desc:'后台登录',
      method:'loginPage',
      type:GET,
      selected:true
    },
    logout:{
      path:'/logout',
      desc:'退出登录',
      method:'logoutPage',
      type:GET,
      selected:true
    }
  },
  IndexController:{
    default:{
      path:'/',
      desc:'默认首页',
      method:'index',
      type:GET,
      selected:true
    },
    index:{
      path:'/index',
      desc:'后台首页',
      method:'index',
      type:GET,
      selected:true
    },
    welcome:{
      path:'/welcome',
      desc:'后台欢迎',
      method:'welcome',
      type:GET,
      selected:true
    },
  },
  AdminController:{
    adminList:{
      path:'/admin/list',
      desc:'管理员列表',
      method:'adminListPage',
      type:GET,
      selected:false
    },
    adminAdd:{
      path:'/admin/add',
      desc:'添加管理员',
      method:'adminAddPage',
      type:GET,
      selected:false
    }
  },
  AuthController:{
    authList:{
      path:'/auth/list',
      desc:'权限列表',
      method:'authListPage',
      type:GET,
      selected:false
    },
    authAdd:{
      path:'/auth/add',
      desc:'权限添加',
      method:'authAddPage',
      type:GET,
      selected:false
    }
  },
  CateController:{
    cateList:{
      path:'/cate/list',
      desc:'分类列表',
      method:'cateListPage',
      type:GET,
      selected:false
    }
  }
}

// 调用api接口的路由
const adminApi = {
  LoginController:{
    login:{
      path:'/api/adminLogin',
      desc:'登录请求',
      method:'adminLogin',
      type:POST,
      selected:true
    }
  },
  AdminController:{
    adminList:{
      path:'/api/admin/list',
      desc:'获取会员列表',
      method:'adminList',
      type:GET,
      selected:false,
    },
    adminDelete:{
      path:'/api/admin/delete/:id',
      desc:'删除管理员',
      method:'adminUpate',
      type:POST,
      selected:false,
    },
    adminStatus:{
      path:'/api/admin/status/:id',
      desc:'启用/禁用管理员',
      method:'adminUpate',
      type:POST,
      selected:false,
    },
    adminRemove:{
      path:'/api/admin/remove/:id',
      desc:'彻底删除管理员',
      method:'adminAddPage',
      type:POST,
      selected:false
    },
  },
  CateController:{
    cateList:{
      path:'/api/cate/list',
      desc:'权限分类列表',
      method:'cateList',
      type:GET,
      selected:false,
    },
    cateAdd:{
      path:'/api/cate/add',
      desc:'添加权限分类',
      method:'cateAdd',
      type:POST,
      selected:false
    }
  },
  AuthController:{
    authAdd:{
      path:'/api/auth/add',
      desc:'添加选前规则',
      method:'authAdd',
      type:POST,
      selected:false
    },
    authList:{
      path:'/api/auth/list',
      desc:'权限列表',
      method:'authList',
      type:GET,
      selected:false
    }
  }
}


// 导出
module.exports = {
  adminApi,
  adminPage,
  requestType:{
    POST,
    PATCH,
    DELETE,
    GET
  }
}