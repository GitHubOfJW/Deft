
// 获取servevice
const MetaService = require('../service/MetaService')

module.exports =  class MetaController {
  // 获取平台数据
  static async allPlatform(ctx, next) {
    // 获取平台数据
    const plateform = await MetaService.getPlatform()
    // 启动的才会被取出
    const data = plateform.filter(item => item.enable)
    ctx.body = {
      code: 20000,
      message: '成功',
      data: data
    }
  }
}