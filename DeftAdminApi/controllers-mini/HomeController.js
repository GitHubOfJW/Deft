const BannerService = require('../service/BannerService')
const ArticleService = require('../service/ArticleService')

module.exports =  class HomeController {

  // 获取首页数据
  static async home(ctx, next){

    // 获取首页的banner
    const banners = await BannerService.miniBanners()
    // 获取最新上架
    const latest = await ArticleService.getLastest(1,10)
    // 组织数据
    const datas = []
    datas.push({
      type: 'banner',
      data: banners
    })
    datas.push({
      title: '最新上线',
      type: 'latest',
      data: latest.rows
    })
    
    ctx.body = {
      code: 0,
      message: '获取成功',
      data: datas
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
        total: data.rows,
        items: data.rows
      }
    }
  }
  
}