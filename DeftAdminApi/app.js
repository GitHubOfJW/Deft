const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const jsonp = require('koa-jsonp')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
const cors = require('koa2-cors')
const compress = require('koa-compress')
const router = require('koa-router')()
const path = require('path')
const fs =  require('mz/fs')

const { sessionConfig, domain } = require('./config')
const koaRequest = require('koa-http-request')

// const enforceHttps = require('koa-sslify').default;

// app.use(enforceHttps())

// cors
app.use(cors({
  origin:'*'
}))

app.use(koaRequest({
  json:false,
  timeout: 30000
}))

// middlewares
app.use(bodyparser(
  // {
  //   enableTypes:['json', 'form', 'text']
  // }
))

// logger
app.use(logger())

// gzip
app.use(compress({threshold:2048}))
// json
app.use(json())

//  jsonp
app.use(jsonp())

// static
app.use(require('koa-static')(__dirname + '/public'))

// session
app.keys = ['1Ab2Bb3Cc4Dd'];
app.use(session(sessionConfig, app));

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })
// 全局
app.use(async (ctx,next)=>{
  //全局的G变量
  ctx.state.G={
      url: domain,
      prevPage:ctx.request.headers['referer']   /*上一页的地址*/
  }
  await next()
})

// 授权
const loadAuth = require('./middleware/login-auth')
app.use(loadAuth())

const checkAuth = require('./middleware/check-auth')
app.use(checkAuth())

const streamFile = require('./middleware/stream-file')
app.use(streamFile())

// routes
const files = fs.readdirSync('./routes')
// 遍历加载路由
for(let fileName of files){
  const js_file = path.join(__dirname,'routes',fileName)
  if(fs.existsSync){
    const router = require(js_file)
    app.use(router.routes(), router.allowedMethods())
  }else{
    console.log(js_file,'不存在')
  }
}

// mini Routers
const miniFiles = fs.readdirSync('./routes-mini')
// 遍历加载路由
for(let fileName of miniFiles){
  const js_file = path.join(__dirname,'routes-mini',fileName)
  if(fs.existsSync){
    const router = require(js_file)
    app.use(router.routes(), router.allowedMethods())
  }else{
    console.log(js_file,'不存在')
  }
}

// error handler
onerror(app)

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
