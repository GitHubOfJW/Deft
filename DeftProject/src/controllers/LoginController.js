// 引入BaseController 
const BaseController = require('./BaseController')
// 引入会员model
const admins = require('../models/adminManager/Admin')

class LoginController extends BaseController {

  // 跳转到首页
  static loginPage(req,res){
    super.setHtmlHeader(res)
    res.render('login.html');
  }

  // 退出登录
  static logoutPage(req,res){
    // 删除用户信息
     delete req.session.user;
     res.redirect('/login');
  }

  // 登录
  static async adminLogin(req,res){
    // 获取登录数据
    if(req.body && req.body.username && req.body.password){
      const model = await admins.adminLogin(req.body.username,req.body.password);
      if(model){
        // 设置model到sesson中
        req.session.user = model;
        res.json(super.handlerResponseData(1,"登录成功"));
      }else{
        res.json(super.handlerResponseData(0,"账号或密码不存在"));
      }
    }else{
      res.json(super.handlerResponseData(0,"缺少请求参数"));
    }
  }
}


module.exports = LoginController