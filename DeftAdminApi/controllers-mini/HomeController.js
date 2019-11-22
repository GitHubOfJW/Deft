const BannerService = require('../service/BannerService')
const ArticleService = require('../service/ArticleService')

module.exports =  class HomeController {

  // 获取首页数据
  static async home(ctx, next){

    const { page = 1, limit = 6, cate_id  = 0} = ctx.query


    const datas = []
    if(cate_id == 0){
      // 获取首页的banner
      const banners = await BannerService.miniBanners()
      datas.push({
        type: 'banner',
        data: banners
      })
    }else{
      // 查询所在分类
      const subCatesData = await ArticleService.getSubCates({ page, limit: 9, cate_id})
      datas.push({
        type: 'category',
        data: subCatesData.rows,
        total: subCatesData.total
      })
    }

    // 获取最新上架
    const latest = await ArticleService.getLastest({page,limit,cate_id})
    // 最新上线
    datas.push({
      title: '最新上线',
      type: 'panel',
      data: latest.rows
    })

    // 获取热门推荐
    const hots = await ArticleService.getHots({page,limit,cate_id})
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