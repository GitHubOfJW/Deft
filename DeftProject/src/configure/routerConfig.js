

// 所有的路由都配置导这里


// 跳转页面的路由
const adminPage = {
  default:{
    path:'/',
    desc:'默认首页',
    selected:true
  },
  login:{
    path:'/login',
    desc:'后台登录',
    selected:true
  },
  index:{
    path:'/index',
    desc:'后台首页',
    selected:true
  },
  welcome:{
    path:'/welcome',
    desc:'后台欢迎',
    selected:true
  },
  logout:{
    path:'/logout',
    desc:'退出登录',
    selected:true
  },
  adminList:{
    path:'/admin/list',
    desc:'会员列表',
    selected:false
  }
}

// 调用api接口的路由
const adminApi = {
  login:{
    path:'/api/adminLogin',
    desc:'登录请求',
    selected:true
  },
  index:{
    path:'/api/index',
    desc:'登录请求',
    selected:true
  },
  adminList:{
    path:'/api/admin/list',
    desc:'获取会员列表',
    selected:false,
  },
  adminDelete:{
    path:'/api/admin/delete/:id',
    desc:'删除管理员',
    selected:false,
  },
  adminStatus:{
    path:'/api/admin/status/:id',
    desc:'启用/禁用管理员',
    selected:false,
  },
  adminRemove:{
    path:'/api/admin/remove/:id',
    desc:'彻底删除管理员',
    selected:false
  }
}


// 导出
module.exports = {
  adminApi,
  adminPage
}