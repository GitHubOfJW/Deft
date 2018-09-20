// 引入BaseController 
const BaseController = require('./BaseController')
// 引入会员model
const members = require('../models/userManager/mebers')


// 引入文件读取
const fse = require('fs-extra')
const path = require('path')

class LoginController extends BaseController {

  // 跳转到首页
  loginPage(req,res){
    super.setHtmlHeader(res)
    res.render('login.html');
  }

  // 退出登录
  logoutPage(req,res){
     res.redirect('/login');
  }

  // 登录
  async memberLogin(req,res){
    // 获取登录数据
    if(req.body && req.body.username && req.body.password){
      const model = await members.memberLogin(req.body.username,req.body.password);
      console.log(model)
      if(model){
        res.json(super.handlerResponseData(1,{member:model},"登录成功"));
      }else{
        res.json(super.handlerResponseData(0,{},"账号或密码不存在"));
      }
    }else{
      res.json(super.handlerResponseData(0,{},"缺少请求参数"));
    }
  }
}


module.exports =  new LoginController()