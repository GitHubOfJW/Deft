

const bodyParser =  require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const express = require('express');
const path =  require('path');
const template = require('art-template')

const { adminApi, adminPage } = require('../configure/routerConfig')

class AppDelegate {

  // 初始化
  configApp(app){

      // 模版引擎
      app.set('views',path.join(__dirname,'../views'));
      app.set('view engine', 'html');
      app.engine('html', require('express-art-template'));
      app.set('view options', {
          debug: process.env.NOE_ENV !== 'production'
      });

      // 修改定界符
      const rule = template.defaults.rules[0];
      rule.test = new RegExp(rule.test.source.replace('<%', '<\\\?').replace('%>', '\\\?>'));

      const rule1 = template.defaults.rules[1];
      rule1.test = new RegExp(rule1.test.source.replace('{{', '\\\[{').replace('}}', '}\\\]'));
      

      // 静态资源文件
      const options = {
        dotfiles: 'ignore',
        etag: false,
        extensions: ['css', 'js'],
        index: false,
        maxAge: '1d',
        redirect: false,
        setHeaders: function (res, path, stat) {
          res.set('x-timestamp', Date.now())
        }
      }
      app.use('/public',express.static('public', options))

      // promoise
      app.use(require('express-promise')());
      
   
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

      // 设置session
      const session = require('express-session')
      const MysqlStore =  require('express-mysql-session')(session);
      const { sessionDbConfig } = require('../configure/config')
      const sessionStore =  new MysqlStore(sessionDbConfig)
      app.use(session({
        key: 'session_cookie_name',
        secret: 'zjw123456789',
        store: sessionStore,
        resave: false,
        saveUninitialized: true
      }));


      this.authRouter(app)
 
       
      // 设置返回编码
      app.use((req,res,next)=>{
        res.setHeader('content-type',"application/json");
        res.setHeader('charset','utf-8');
        next();
      });
  }

  // 异常处理
  errorHander(app){
    app.use(function(error,req,res,next){
      res.end(JSON.stringify({message:"出现错误",error:error}))
    })
  }


  authRouter(app){
      app.use((req,res,next)=>{
        
         // 如果是未登录跳到登录
         const exclude = [
           adminApi.LoginController.login.path,
           adminPage.LoginController.login.path,
           adminPage.LoginController.logout.path
          ]
 
         let routerPath =  req.originalUrl;
        //  console.log(routerPath)
         if(!req.session.user && !exclude.some(path => path === routerPath)){
            if(routerPath.indexOf('/api')>=0){
               res.json({
                 status:-1,
                 message:'当前未登录'
               });
            }else{
               res.redirect(adminPage.LoginController.login.path);             
            }
         }else{
             next();
         }
      });
  }
}

module.exports = new AppDelegate();