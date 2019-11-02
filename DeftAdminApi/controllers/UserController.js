const fetch =  require('node-fetch')
const UserService  = require('../service/UserService')

module.exports =  class UserController {
  // 登录 
  static async login(ctx, next) {
    let { mobile, code, type = 1 } = ctx.request.body
    const result = await UserService.login({
      mobile:mobile,
      code: code,
      type: type
    })
    ctx.body = result
  }

  // 更新信息
  static async update (ctx, next) {
    const id =  ctx.params.id
    const body =  ctx.request.body
    await UserService.update(body, id)

    ctx.body = {
      code: 20000,
      message: '成功'
    }
  }
}