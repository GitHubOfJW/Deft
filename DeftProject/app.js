//引入express
const express = require('express');

const app = express();

app.use((req,res,next)=>{
  req.domainName = 'http://localhost:3000';
  next();
});


const appDelete = require('./src/utils/AppDelegate')
appDelete.configApp(app);

// 路由
const indexRouter = require('./src/router/index');
app.use(indexRouter);

// 异常处理
appDelete.errorHander(app);

let server = app.listen(3000,'127.0.0.1',() => {
  let host = server.address().address;
  let port = server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
});