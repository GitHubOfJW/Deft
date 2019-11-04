const ArticleService =  require('../service/ArticleService')

module.exports = class ArticleController {

  // 全部分类
  static async allCates(ctx, next) {
    const data = await ArticleService.allCates()
    ctx.body = {
      code: 20000,
      message: '成功',
      data: {
        items:data.rows,
        total:data.count
      }
    }
  }

  // 全部标签
  static async alllabels(ctx, next) {
    const data = await ArticleService.alllabels()
    ctx.body = {
      code: 20000,
      message: '成功',
      data: {
        items:data.rows,
        total:data.count
      }
    }
  }

  // 分类
  static async cateParentList(ctx, next){
    const data = await ArticleService.cateParentList(ctx.query)
    ctx.body = {
      code: 20000,
      message: '获取成功',
      data: {
        items: data.rows,
        total: data.counts
      }
    }
  }
  
  // 分类
  static async cateList(ctx, next) {
    // 查找
    const data = await ArticleService.cateList(ctx.query)

    ctx.body = {
      code: 20000,
      message: '获取成功',
      data: {
        items:data.rows,
        total:data.count
      }
    }
  }

  // 创建
  static async cateCreated(ctx, next) {
    const body = ctx.request.body
    const id = await ArticleService.cateAdd(body)
    ctx.body = {
      code: 20000,
      message:'成功',
      data: {
        id: id
      }
    }
  }

  // 编辑
  static async cateEdit(ctx, next) {
    const { id } =  ctx.params
    const result = await ArticleService.cateEdit(ctx.request.body, id)
    ctx.body = {
      code: 20000,
      message: '成功'
    }
  }

  // 删除
  static async cateDelete(ctx, next) {
    const { id } = ctx.params
    const result  = await ArticleService.cateDelete(id)
    ctx.body = {
      code: 20000,
      message: '成功'
    }
  }

  // 恢复
  static async cateRecover(ctx, next) {
    const { id } = ctx.params
    const result = await ArticleService.cateRecover(id)
    ctx.body = {
      code: 20000,
      message: '成功'
    }
  }


  ///

  // 文章
  static async articleList(ctx, next) {
    // 查找
    const data = await ArticleService.articleList(ctx.query)

    ctx.body = {
      code: 20000,
      message: '获取成功',
      data: {
        items:data.rows,
        total:data.count
      }
    }
  }

  // 文章详情
  static async articleDetail(ctx, next){
    console.log(ctx.params)
    const data =  await ArticleService.articleDetail(ctx.params.id)
    ctx.body = {
      code: 20000,
      message: '获取成功',
      data: data
    }
  }

  // 创建
  static async articleCreated(ctx, next) {
    const body = ctx.request.body
    body.author_id = ctx.session.id
    const id = await ArticleService.articleAdd(body)
    ctx.body = {
      code: 20000,
      message:'成功',
      data: {
        id: id
      }
    }
  }

  // 编辑
  static async articleEdit(ctx, next) {
    const { id } =  ctx.params
    const body = ctx.request.body
    body.author_id = ctx.session.id
    const result = await ArticleService.articleEdit(body, id)
    ctx.body = {
      code: 20000,
      message: '成功'
    }
  }

  // 删除
  static async articleDelete(ctx, next) {
    const { id } = ctx.params
    const result  = await ArticleService.articleDelete(id)
    ctx.body = {
      code: 20000,
      message: '成功'
    }
  }

  // 恢复
  static async articleRecover(ctx, next) {
    const { id } = ctx.params
    const result = await ArticleService.articleRecover(id)
    ctx.body = {
      code: 20000,
      message: '成功'
    }
  }

  ///

  // 标签
  static async labelList(ctx, next) {
    // 查找
    const data = await ArticleService.labelList(ctx.query)

    ctx.body = {
      code: 20000,
      message: '获取成功',
      data: {
        items:data.rows,
        total:data.count
      }
    }
  }

  // 创建
  static async labelCreated(ctx, next) {
    const body = ctx.request.body
    const id = await ArticleService.labelAdd(body)
    ctx.body = {
      code: 20000,
      message:'成功',
      data: {
        id: id
      }
    }
  }

  // 编辑
  static async labelEdit(ctx, next) {
    const { id } =  ctx.params
    const result = await ArticleService.labelEdit(ctx.request.body, id)
    ctx.body = {
      code: 20000,
      message: '成功'
    }
  }

  // 删除
  static async labelDelete(ctx, next) {
    const { id } = ctx.params
    const result  = await ArticleService.labelDelete(id)
    ctx.body = {
      code: 20000,
      message: '成功'
    }
  }

  // 恢复
  static async labelRecover(ctx, next) {
    const { id } = ctx.params
    const result = await ArticleService.labelRecover(id)
    ctx.body = {
      code: 20000,
      message: '成功'
    }
  }
}