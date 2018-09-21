//引入express
const express = require('express');

const app = express();

const appConfigure = require('./src/utils/AppConfigure')
appConfigure.configApp(app);

// 路由
const indexRouter = require('./src/router/index');
app.use(indexRouter);
const loginRouter = require('./src/router/login');
app.use(loginRouter);
const adminRouer =  require('./src/router/admin');
app.use(adminRouer);

// 异常处理
appConfigure.errorHander(app);

let server = app.listen(8080 ,() => {
  let host = server.address().address;
  let port = server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
});