const path =  require('path')
const uuidv4 = require('uuid/v4')
const fs = require('fs')
const BannerService = require('../service/BannerService')

module.exports = class BannerController {
  // 获取banner
  static async list(ctx, next){
    const data = await BannerService.list(ctx.query)

    ctx.body = {
      code: 20000,
      message: '查询成功',
      data: {
        items: data.rows,
        total: data.count
      }
    }
  }

  // 添加
  static async create(ctx, next){
    const data =  ctx.request.body

    console.log(data)
    // 添加成
    const banner =  await BannerService.create(data)
    
    ctx.body = {
      code: 20000,
      message: '添加成功',
      data: {
        id: banner.id
      }
    }
  }

  // 修改
  static async update(ctx, next){
    const body = ctx.request.body
    delete body.id

    const {id} = ctx.params
    
    const result = await BannerService.update(id,body)

    ctx.body = {
      code: 20000,
      message: '修改成功'
    }
  }

  // 详情
  static async detail(ctx, next){
    const {id} = ctx.params

    const banner = await BannerService.detail(id)

    ctx.body = {
      code: 20000,
      message: "获取成功",
      data: data
    }
  }

  // 删除
  static async delete(ctx, next){
    const {id} = ctx.params

    await BannerService.deleteById(id)

    ctx.body = {
      code: 20000,
      message: "删除成功"
    }
  }
  
  // 恢复
  static async recover(ctx, next){
    const {id} = ctx.params

    await BannerService.recoverById(id)

    ctx.body = {
      code: 20000,
      message: '恢复成功'
    }
  }
}