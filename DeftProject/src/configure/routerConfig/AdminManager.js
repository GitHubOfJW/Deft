
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
    unicode:{
      path:'/unicodee',
      desc:'图标字体',
      method:'unicode',
      type:GET,
      selected:true
    }
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
    },
    adminEdit:{
      path:'/admin/edit/:id',
      desc:'编辑管理员',
      method:'adminEditPage',
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
    },
    authEdit:{
      path:'/auth/edit/:id',
      desc:'修改权限',
      method:'authEditPage',
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
  },
  RoleController:{
    roleList:{
      path:'/role/list',
      desc:'角色列表',
      method:'roleListPage',
      type:GET,
      selected:false
    },
    roleAdd:{
      path:'/role/add',
      desc:'角色添加',
      method:'roleAddPage',
      type:GET,
      selected:false
    },
    roleEdit:{
      path:'/role/edit/:id',
      desc:'角色修改',
      method:'roleEditPage',
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
      desc:'管理员列表请求',
      method:'adminList',
      type:GET,
      selected:false,
    },
    adminAdd:{
      path:'/api/admin/add',
      desc:'添加管理员',
      method:'adminAdd',
      type:POST,
      selected:false
    },
    adminEdit:{
      path:'/api/admin/edit/:id',
      desc:'添加管理员',
      method:'adminEdit',
      type:POST,
      selected:false
    },
    adminStatus:{
      path:'/api/admin/status/:id',
      desc:'启用/禁用管理员',
      method:'adminUpdate',
      type:POST,
      selected:false,
    },
    adminDelete:{
      path:'/api/admin/delete',
      desc:'删除管理员',
      method:'adminDelete',
      type:POST,
      selected:false,
    },
    // adminRemove:{
    //   path:'/api/admin/remove',
    //   desc:'彻底删除管理员',
    //   method:'adminRemove',
    //   type:POST,
    //   selected:false
    // },
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
    },
    cateEdit:{
      path:'/api/cate/edit/:id',
      desc:'修改权限分类',
      method:'cateUpdate',
      type:POST,
      selected:false
    },
    // cateDelete:{
    //   path:'/api/cate/delete',
    //   desc:'删除权限分类',
    //   method:'cateDelete',
    //   type:POST,
    //   selected:false,
    // },
    cateRemove:{
      path:'/api/cate/remove',
      desc:'彻底删除权限分类',
      method:'cateRemove',
      type:POST,
      selected:false
    },
  },
  AuthController:{
    authAdd:{
      path:'/api/auth/add',
      desc:'添加权限规则',
      method:'authAdd',
      type:POST,
      selected:false
    },
    authList:{
      path:'/api/auth/list',
      desc:'获取权限列表',
      method:'authList',
      type:GET,
      selected:false
    },
    authEdit:{
      path:'/api/auth/edit/:id',
      desc:'修改权限',
      method:'authEdit',
      type:POST,
      selected:false
    },
    // authDelete:{
    //   path:'/api/auth/delete',
    //   desc:'删除管理员',
    //   method:'authDelete',
    //   type:POST,
    //   selected:false
    // },
    authRemove:{
      path:'/api/auth/remove',
      desc:'彻底删除权限',
      method:'authRemove',
      type:POST,
      selected:false
    },
  },
  RoleController:{
    roleAdd:{
      path:'/api/role/add',
      desc:'角色添加',
      method:'roleAdd',
      type:POST,
      selected:false
    },
    roleList:{
      path:'/api/role/list',
      desc:'获取角色列表',
      method:'roleList',
      type:GET,
      selected:false
    },
    roleEdit:{
      path:'/api/role/edit/:id',
      desc:'修改角色',
      method:'roleEdit',
      type:POST,
      selected:false
    },
    roleStatus:{
      path:'/api/role/status/:id',
      desc:'启用/禁用角色',
      method:'roleUpate',
      type:POST,
      selected:false,
    },
    roleDelete:{
      path:'/api/role/delete',
      desc:'删除管理员',
      method:'roleDelete',
      type:POST,
      selected:false
    },
    // roleRemove:{
    //   path:'/api/role/remove',
    //   desc:'彻底删除角色',
    //   method:'roleRemove',
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