const BannerService = require('../service/BannerService')
const ArticleService = require('../service/ArticleService')

module.exports =  class HomeController {

  // 获取首页数据
  static async home(ctx, next){

    // 获取首页的banner
    const banners = await BannerService.miniBanners()
    // 获取最新上架
    const latest = await ArticleService.getLastest(1,6)
    // 获取热门推荐
    const hots = await ArticleService.getHots(1,6)
    // 组织数据
    const datas = []
    datas.push({
      type: 'banner',
      data: banners
    })
    // 最新上线
    datas.push({
      title: '最新上线',
      type: 'panel',
      data: latest.rows
    })
    // 热门推荐
    datas.push({
      title: '热门推荐',
      type: 'panel',
      data: hots.rows
    })
    
    ctx.body = {
      code: 0,
      message: '获取成功',
      data: datas
    }
  }

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

  // 获取菜单
  static async mainMenus(ctx, next){
    // 获取主菜单
    const data = await ArticleService.cateParentList({
      page:1,
      limit: 10000
    })

    ctx.body = {
      code: 0,
      message: '获取成功',
      data: {
        total: data.count,
        items: data.rows
      }
    }
  }
}