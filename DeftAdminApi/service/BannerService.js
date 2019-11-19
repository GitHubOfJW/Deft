const {Banner,Sequelize,sequelize} = require('../models/banners/Banner')
const {Source} = require('../models/bases/Source')

Banner.belongsTo(Source,{
  foreignKey: 'banner_id',
  constraints:false,
  as: 'banner'
})

module.exports = class BannerService {
  // 获取banner
  static async list ({page = 1, limit = 20, platform = 0}){
    // 查询banner
    const data = await Banner.findAndCountAll({
      include:[{
        attributes: {
          include: ['id','url']
        },
        model: Source,
        as: "banner"
      }],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [[Sequelize.col('is_delete'),'DESC'],[Sequelize.col('sort'),'ASC']]
    })

    return data
  }

  // 新增
  static async create(body){
    // 新增
    return sequelize.transaction(t=>{
      return (async ()=>{
        // 首先获取bann中的图标id
        if(body.banner_id){
          Source.update({
            ref_count: Sequelize.literal('`ref_count` +1')
          },{
            where: {
              id: body.banner_id
            },
            transaction:t
          })
        }
        // 新增banner
        return await Banner.create(body,{
          transaction:t
        })
      })()
    })
  }

  // 修改
  static async update(id,body){
    return sequelize.transaction(t=>{
      return (async ()=>{
        // 获取
        const edit_banner = await Banner.findOne({
          where: {
            id: id
          },
          transaction:t
        })
        // 怕断是否有banner_id
        if(body.banner_id && body.banner_id != edit_banner.banner_id){
           // 更新source 计数
           await Source.update({
             ref_count: Sequelize.literal('`ref_count` -1')
           },{
             where: {
               id: edit_banner.banner_id
             },
             transaction:t
           })
           await Source.update({
             ref_count: Sequelize.literal('`ref_count` +1')
           },{
             where: {
               id: body.banner_id
             }
           })
        }

        // 修改
        return await Banner.update(body,{
          where:{
            id: id
          }
        })
      })()
    })
  }

  // 获取详情
  static async detail(id){
    return await Banner.findOne({
      include:[{
        attributes: {
          include: ['id','url']
        },
        model: Source,
        as: "banner"
      }],
      where:{
        id: id
      }
    })
  }

  // 删除
  static async deleteById (id){
    return await Banner.update({
      is_delete: true
    },{
      where: {
        id: id
      }
    })
  }

  // 恢复
  static async recoverById (id) {
    return await Banner.update({
      is_delete: false
    },{
      where: {
        id: id
      }
    })
  }


  /**
   * 下面是小程序的方法
   */

  // 获取小程序banner
  static async miniBanners(platform = 1){
    return await Banner.findAll({
      include: [{
        attributes:{
          include: ['id','url']
        },
        model: Source,
        as: 'banner'
      }],
      where: {
        platform: platform,
        is_delete: false
      }
    })
  }
}