
const bodyParser =  require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

class AppConfigure {

  // 初始化
  configApp(app){
 
      // parse application/x-www-form-urlencoded
      app.use(bodyParser.urlencoded({ extended: false }))
      // parse application/json
      app.use(bodyParser.json())

      // 设置cookieparser
      app.use(cookieParser());
      // 设置method-override
      app.use(methodOverride('X-HTTP-Method')) //          Microsoft
      app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
      app.use(methodOverride('X-Method-Override')) //      IBM

      // 设置返回编码
      app.use(function(req,res,next){
        res.setHeader('content-type',"application/json");
        res.setHeader('charset','utf-8');
        next();
      });
  }

  // 异常处理
  errorHander(app){
    // app.use(function(error,req,res,next){
    //     res.end(JSON.stringify({message:"出现错误"}))
    // })
  }
}

module.exports = new AppConfigure();