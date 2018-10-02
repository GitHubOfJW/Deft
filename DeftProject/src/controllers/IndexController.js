// 引入BaseController 
const BaseController = require('./BaseController')

class IndexController extends BaseController {

  // 跳转到首页
  static async index(req,res){
    super.setHtmlHeader(res)
    res.render('index.html');
  }


  // 跳转到欢迎页
  static async welcome(req,res){
    super.setHtmlHeader(res)
    res.render('welcome.html');
  }
}


module.exports = IndexController