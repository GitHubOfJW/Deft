

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
  }
}

// 调用api接口的路由
const adminApi = {
  login:{
    path:'/api/memberLogin',
    desc:'登录请求',
    selected:true
  },
  index:{
    path:'/api/index',
    desc:'登录请求',
    selected:true
  }
}


// 导出
module.exports = {
  adminApi,
  adminPage
}