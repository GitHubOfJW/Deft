// 引入BaseController 
const BaseController = require('./BaseController')


// 引入文件读取
const fse = require('fs-extra')
const path = require('path')

class IndexController extends BaseController {

  // 跳转到首页
  async index(req,res){
    super.setHtmlHeader(res)
    res.render('index.html');
  }


  // 跳转到欢迎页
  async welcome(req,res){
    super.setHtmlHeader(res)
    res.render('welcome.html');
  }
}


module.exports =  new IndexController()