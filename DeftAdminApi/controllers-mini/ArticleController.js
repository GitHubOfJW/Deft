const BannerService = require('../service/BannerService')
const ArticleService = require('../service/ArticleService')

module.exports =  class ArticleController {

  // 列表数据
  static async list(ctx, next){
    // 查询列表
    const data = await ArticleService.miniArticleList(ctx.query)
    ctx.body = {
      code: 0,
      message: '成功',
      data: {
        total: data.count,
        items: data.rows
      }
    }
  }

  // 详情
  static async detail(ctx, next) {
    if(!ctx.query.article_id){
      ctx.body = {
        code:1,
        message: '未获取到id'
      }
    }
    const data = await ArticleService.miniArticleDetail(ctx.query.article_id)

    ctx.body = {
      code: 0,
      message:'获取成功',
      data: data
    }
  }

  // 读取了文章
  static async read(ctx, next){
    const { id } = ctx.params

    await ArticleService.read(id)

    ctx.body = {
      code: 0,
      message: '成功'
    }
  }
}