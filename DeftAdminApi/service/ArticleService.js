const { Article,Sequelize,sequelize } = require('../models/article/Article')
const { ArticleCate } = require('../models/article/ArticleCate')
const { ArticleLabel } = require('../models/article/ArticleLabel')
const { ArticleLabelRel } =  require('../models/article/ArticleLabelRel')
const { ArticleCateRel } = require('../models/article/ArticleCateRel')
const { Class } = require('../models/class/Class')
const { Member } = require('../models/Member')
const { Source } = require('../models/bases/Source')

Article.belongsTo(Member,{
  foreignKey: 'author_id',
  constraints: false
})

ArticleCate.belongsTo(Source,{
  foreignKey: 'icon_id',
  constraints: false,
  as:'icon'
})

Article.belongsTo(Source,{
  foreignKey: 'pic_id',
  constraints: false,
  as:'pic'
})

Article.belongsToMany(ArticleLabel,{
  through: ArticleLabelRel,
  foreignKey: 'article_id',
  otherKey: 'label_id',
  as: 'articlelabels',
  constraints: false
})

// ArticleLabel.belongsToMany(Article, {
//   through: ArticleLabelRel,
//   foreignKey: 'label_id',
//   otherKey: 'article_id',
//   as: 'labelarticles',
//   constraints: false
// })

Article.belongsToMany(ArticleCate,{
  through: ArticleCateRel,
  foreignKey: 'article_id',
  otherKey: 'cate_id',
  as: 'articlecates',
  constraints: false
})

ArticleCate.belongsToMany(Article, {
  through: ArticleCateRel,
  foreignKey: 'cate_id',
  otherKey: 'article_id',
  as: 'catearticles',
  constraints: false
})

ArticleCate.hasMany(ArticleCate, {
  foreignKey: 'parent_id',
  as: 'subCates',
  constraints: false
})
ArticleCate.belongsTo(ArticleCate, {
  foreignKey: 'parent_id',
  as: 'father',
  constraints: false
})

// 小程序获取最新分类
Article.hasMany(ArticleCateRel, {
  foreignKey: 'article_id'
})

module.exports = class ArticleService {


  // 所有分类
  static async allCates() {
    const data = await ArticleCate.findAndCountAll({
      where: {
        parent_id:0
      },
      include:[{
        model: Source,
        attributes:{
          include: ['url','id']
        },
        as: 'icon'
      },{
        model: ArticleCate,
        include: {
          model: Source,
          attributes:{
            include: ['url','id']
          },
          as: 'icon'
        },
        as: 'subCates'
      }]
    })
    return data
  }

  // 所有标签
  static async alllabels() {
    const data = await ArticleLabel.findAndCountAll()
    return data
  }

  // 分类
  static async cateParentList({ page = 1, limit = 20 }){

    //  查询
    const data = await ArticleCate.findAndCountAll({
      where: {
        parent_id: 0
      },
      offset: ((page-1) * limit)+0,
      limit: parseInt(limit)
    })

    return data
  }

  // 文章分类
  static async cateList({ page = 1, limit = 20, name = '', path = '', sort = '+sort',is_delete = false}){
    const orders = (sort).split(',')
    const orderby = []
    for(let sortItem of orders){
       orderby.push([Sequelize.col(sortItem.substring(1)),sortItem.startsWith('+') ? 'ASC':'DESC'])
    }

    const where = {
      parent_id:0,
      is_delete:is_delete,
      name: {
        [Sequelize.Op.like]: `%${ name }%`,
      }
    }

    //  查询
    const data = await ArticleCate.findAndCountAll({
      where:where,
      include:[{
        model: Source,
        attributes:{
          include: ['url','id']
        },
        as: 'icon'
      },{
        model: ArticleCate,
        include: {
          model: Source,
          attributes:{
            include: ['url','id']
          },
          as: 'icon'
        },
        as: 'subCates'
      }],
      order:orderby,
      offset: ((page-1) * limit)+0,
      limit: parseInt(limit)
    })

    return data
  }

  // 添加文章
  static async cateAdd(body = {}) {
    return sequelize.transaction(t => {
      return (async ()=>{
        // 累计
        await Source.update({
          ref_count: Sequelize.literal('`ref_count` +1')
        },{
          where: {
            id: body.icon_id
          },
          transaction:t
        })
        // 更新
        const result = await ArticleCate.create(body,{transaction:t})
        return result.id
      })()
    })
  }

  // 修改
  static async cateEdit(body = {},id = 0) {
    return sequelize.transaction(t => {
      return (async ()=>{
        const cate = await ArticleCate.findOne({
          where: {
            id: id
          },
          transaction:t
        })
        delete body.createdAt
        delete body.updatedAt
        delete body.sort
        delete body.is_delete

        // 如果之前就是根分类，现在也必须是根分类
        if(cate.parent_id == 0){
          delete body.parent_id
        }else if(body.parent_id == 0) { // 如果之前不是根分类，现在也必须不能是根分类
          delete body.parent_id
        }
        
        // 累计资源
        if(body.icon_id){
           if(body.icon_id != cate.icon_id){
            // 新的加
            await Source.update({
              ref_count: Sequelize.literal('`ref_count` +1')
            },{
              where:{
                id: body.icon_id
              },
              transaction:t
            })
            // 旧的减
            await Source.update({
              ref_count: Sequelize.literal('`ref_count` -1')
            },{
              where: {
                id: cate.icon_id
              },
              transaction: t
            })
           }
        }else{
          delete body.icon_id
        }

        // 更新
        const result = await ArticleCate.update(body,{
          where: {
            id: id
          },
          transaction: t
        })
        return result
      })() 
    })
  }

  // 删除
  static async cateDelete(id = 0 ) {
    // 删除
    const result = await ArticleCate.update({
      is_delete: true
    }, {
      where: {
        id: id
      }
    })
    return result
  }

  // 恢复
  static async cateRecover(id = 0) {
    const result = await ArticleCate.update({
      is_delete: false
    }, {
      where: {
        id:id
      }
    })
    return result
  }


    // 文章
  static async articleList({ page = 1, limit = 20, title = '', path = '', parent_id = 0, sort = '+sort', is_delete = false}){
    const orders = (sort).split(',')
    const orderby = []
    for(let sortItem of orders){
        orderby.push([Sequelize.col(sortItem.substring(1)),sortItem.startsWith('+') ? 'ASC':'DESC'])
    }

    const where = {
      is_delete: is_delete,
      title: {
        [Sequelize.Op.like]: `%${ title }%`,
      }
    }

    //  查询
    const data = await Article.findAndCountAll({
      attributes:{
        exclude: ['rich_content']
      },
      where:where,
      include:[{
        model: ArticleCate,
        attributes: {
          include: ['name','id']
        },
        as: 'articlecates'
      },{
        model: ArticleLabel,
        attributes: {
          include: ['name','id'],
        },
        as: 'articlelabels'
      },{
        model: Member
      },{
        model: Source,
        attributes: ['url','id'],
        as: 'pic'
      }],
      order:orderby,
      offset: ((page-1) * limit)+0,
      limit: parseInt(limit)
    })

    return data
  }

  // 获取文章详情
  static async articleDetail(id = 0){
    return await Article.findOne({
      attributes: {
        include: ['id', 'source_uri', 'rich_content']
      },
      where: {
        id: id
      }
    })
  }

  // 添加文章
  static async articleAdd(body = {}) {
    
    return sequelize.transaction(t => {
      return (async () => {
        // 创建文章
        const add_article = await Article.create(body,{
          transaction:t
        })

        // 更新资源标记
        await Source.update({ref_count:sequelize.literal('`ref_count` +1')}, {
          where: {
            id: body.pic_id
          }
        },{transaction:t})

        // 设置文章对应的分类
        if(body.cate_ids){
          const cates = await ArticleCate.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: (body.cate_ids || []).map(item => item[1])
              },
              parent_id: {
                [Sequelize.Op.ne]: 0
              }
            }
          },{transaction: t})
          // 设置关系
          await add_article.setArticlecates(cates,{transaction:t})
        }
        // 设置标签
        if(body.label_ids){
          const labels = await ArticleLabel.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: body.label_ids || []
              }
            }
          },{transaction:t})
          await add_article.setArticlelabels(labels,{transaction: t})
        }

        return add_article.id
      })()
    })
  }

  // 修改
  static async articleEdit(body = {},id = 0) {
    return sequelize.transaction(t => {
      return (async () => {
        const edit_article = await Article.findOne({
          include:[{
            model: ArticleCate,
            attributes: {
              include: ['name','id']
            },
            as: 'articlecates'
          }],
          where: {
            id: id
          }
        },{transaction: t})

        delete body.createdAt
        delete body.updatedAt
        delete body.sort
        delete body.is_delete

        
        if(body.pic_id){
          if(body.pic_id != edit_article.pic_id){
           // 新的加
           await Source.update({
             ref_count: Sequelize.literal('`ref_count` +1')
           },{
             where:{
               id: body.pic_id
             },
             transaction:t
           })
           // 旧的减
           await Source.update({
             ref_count: Sequelize.literal('`ref_count` -1')
           },{
             where: {
               id: edit_article.pic_id
             },
             transaction: t
           })
          }
       }else{
         delete body.pic_id
       }

        // 更新计数
        if(body.rich_content){
          body.publish_time = new Date()
          // 获取复文本中的所有资源id
          await Source.update({
            ref_count: Sequelize.literal('`ref_count` -1')
          },{
            where: {
              id: {
                [Sequelize.Op.in]: (edit_article.sources || '').split(',')
              }
            },
            transaction:t
          })
          // 然后在累计文章中的资源
          const ids = this.getAllDataIds(body.rich_content)
          await Source.update({
            ref_count: Sequelize.literal('`ref_count` +1')
          },{
            where: {
              id: {
                [Sequelize.Op.in]: ids || []
              }
            },
            transaction:t
          })
          body.sources = ids.join(',')
        }
        
        // 更新
        await edit_article.update(body,{ transaction: t })

        // 设置文章对应的分类
        if(body.cate_ids){
          const cates = await ArticleCate.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: (body.cate_ids || []).map(item => item[1])
              },
              parent_id: {
                [Sequelize.Op.ne]: 0
              }
            }
          },{transaction: t})

          // 设置关系
          await edit_article.setArticlecates(cates,{transaction:t})
        }

        // 设置标签
        if(body.label_ids){
          const labels = await ArticleLabel.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: body.label_ids || []
              }
            }
          },{transaction:t})
          // 设置关系
          await edit_article.setArticlelabels(labels,{transaction:t})
        }

        return edit_article.id
      })()
    })
  }

  // 删除
  static async articleDelete(id = 0 ) {
    // 删除
    const result = await Article.update({
      is_delete: true
    }, {
      where: {
        id: id
      }
    })
    return result
  }

  // 恢复
  static async articleRecover(id = 0) {
    const result = await Article.update({
      is_delete: false
    }, {
      where: {
        id:id
      }
    })
    return result
  }

  // 标签
  static async labelList({ page = 1, limit = 20, name = '', path = '', parent_id = 0, sort = '+sort' }){
    const orders = (sort).split(',')
    const orderby = []
    for(let sortItem of orders){
       orderby.push([Sequelize.col(sortItem.substring(1)),sortItem.startsWith('+') ? 'ASC':'DESC'])
    }

    const where = {
      name: {
        [Sequelize.Op.like]: `%${ name }%`,
      }
    }

    //  查询
    const data = await ArticleLabel.findAndCountAll({
      where:where,
      order:orderby,
      offset: ((page-1) * limit)+0,
      limit: parseInt(limit)
    })

    return data
  }

  // 添加文章
  static async labelAdd(body = {}) {
    const result = await ArticleLabel.create(body)
    return result.id
  }

  // 修改
  static async labelEdit(body = {},id = 0) {
    delete body.createdAt
    delete body.updatedAt
    delete body.sort
    delete body.is_delete

    // 更新
    const result = await ArticleLabel.update(body,{
      where: {
        id: id
      }
    })
    return result
  }

  // 删除
  static async labelDelete(id = 0 ) {
    // 删除
    const result = await ArticleLabel.update({
      is_delete: true
    }, {
      where: {
        id: id
      }
    })
    return result
  }

  // 恢复
  static async labelRecover(id = 0) {
    const result = await ArticleLabel.update({
      is_delete: false
    }, {
      where: {
        id:id
      }
    })
    return result
  }

  // 计算分类
  static async computedCatesCount(){
    // 首先查统计所有子分类
    return sequelize.transaction(t => {
      return (async ()=>  {
        // 获取所有子分类
        const sub_cates = await ArticleCate.findAll({
          where: {
            parent_id: {
              [Sequelize.Op.ne]: 0
            }
          },
          transaction:t
        })
        // 更新
        for(let subCate of sub_cates) {
          const count = await ArticleCateRel.count({
            where:{
              cate_id: subCate.id
            },
            transaction: t
          })
          await ArticleCate.update({count: count},{where:{id: subCate.id},transaction:t})
        }
        // 更新大分类
        const cates = await ArticleCate.findAll({
          where: {
            parent_id: {
              [Sequelize.Op.eq]: 0
            }
          },
          transaction:t
        })
        // 更新
        for(let cate of cates) {
          const sub_data = await ArticleCate.findAll({
            attributes: [[sequelize.fn('SUM',sequelize.col('count')),'sub_total']]
          },{
            where:{
              parent_id: cate.id
            },
            transaction: t
          })
          await ArticleCate.update({count: sub_data.sub_total},{where:{id: cate.id},transaction:t})
        }
        return true
      })()
    })
  }

  // 获取资源id 根据富文本
  static getAllDataIds(rich_content = ''){
    // data-sourceid="${v.id}"
    const exg = /data-sourceid="(\d?)"/g
    const texts = rich_content.match(exg)
    const ids = []
    if(texts) {
      for(let text of texts){
        const idReg = text.match(/\d+/)
        ids.push(Number(idReg[0]))
      }
    }
    return  ids
  }


  /**
   * 下面是小程序的方法
   */
  // 最新上架
  static getLastest({ page = 1, limit = 20, cate_id = 0}){
    // 默认为0 如果不传则表示大分类
    // 如果传要先查一下当前的分类是大分类还是小分类
    return sequelize.transaction(t => {
      return (async () => {
        // 查询分类
        const cate = await ArticleCate.findOne({
          where: {
            id: cate_id
          },
          transaction:t
        })
        // 根据分类查询文章
        const article_where = {}
        if(cate){
          // 如果是大分类
          if(cate.parent_id == 0){
            const cates = await ArticleCate.findAll({
              where: {
                parent_id: cate.id
              },
              transaction:t
            })
            // 查询
            return await Article.findAndCountAll({
              include: [{
                model: ArticleCateRel,
                scope: {
                  cate_id: {
                    [Sequelize.Op.in]: cates.map(cate => cate.id)
                  }
                }
              },{
                model: Source,
                as: 'pic'
              }],
              order: [[Sequelize.col('id'),'DESC']],
              offset: (page - 1) * limit,
              limit: parseInt(limit),
              transaction:t
            })
          }else{ // 如果小小分类
            return await Article.findAndCountAll({
              include: [{
                model: ArticleCateRel,
                scope: {
                  cate_id: cate.id
                }
              },{
                model: Source,
                as: 'pic'
              }],
              order: [[Sequelize.col('id'),'DESC']],
              offset: (page - 1) * limit,
              limit: parseInt(limit),
              transaction:t
            })
          }
        }else{
          return await Article.findAndCountAll({
            include:[{
              model: Source,
              as: 'pic'
            }],
            order: [[Sequelize.col('id'),'DESC']],
            offset: (page - 1) * limit,
            limit: parseInt(limit),
            transaction:t
          })
        }
      })()
    })
  }
  

  // 热门推荐
  static getHots({ page = 1, limit = 20, cate_id = 0}){
    // 默认为0 如果不传则表示大分类
    // 如果传要先查一下当前的分类是大分类还是小分类
    return sequelize.transaction(t => {
      return (async () => {
        // 查询分类
        const cate = await ArticleCate.findOne({
          where: {
            id: cate_id
          },
          transaction:t
        })
        // 根据分类查询文章
        const article_where = {}
        if(cate){
          // 如果是大分类
          if(cate.parent_id == 0){
            const cates = await ArticleCate.findAll({
              where: {
                parent_id: cate.id
              },
              transaction:t
            })
            // 查询
            return await Article.findAndCountAll({
              include: [{
                model: ArticleCateRel,
                scope: {
                  cate_id: {
                    [Sequelize.Op.in]: cates.map(cate => cate.id)
                  }
                }
              },{
                model: Source,
                as: 'pic'
              }],
              order: [[Sequelize.col('works_count'),'DESC'],[Sequelize.col('collect_count'),'DESC']],
              offset: (page - 1) * limit,
              limit: parseInt(limit),
              transaction:t
            })
          }else{ // 如果小小分类
            return await Article.findAndCountAll({
              include: [{
                model: ArticleCateRel,
                scope: {
                  cate_id: cate.id
                }
              },{
                model: Source,
                as: 'pic'
              }],
              order: [[Sequelize.col('works_count'),'DESC'],[Sequelize.col('collect_count'),'DESC']],
              offset: (page - 1) * limit,
              limit: parseInt(limit),
              transaction:t
            })
          }
        }else{
          return await Article.findAndCountAll({
            include:[{
              model: Source,
              as: 'pic'
            }],
            order: [[Sequelize.col('works_count'),'DESC'],[Sequelize.col('collect_count'),'DESC']],
            offset: (page - 1) * limit,
            limit: parseInt(limit),
            transaction:t
          })
        }
      })()
    })
  }

  // 列表
  static miniArticleList({ page = 1, limit = 20, cate_id = 0}){
    // 默认为0 如果不传则表示大分类
    // 如果传要先查一下当前的分类是大分类还是小分类
    return sequelize.transaction(t => {
      return (async () => {
        // 查询分类
        const cate = await ArticleCate.findOne({
          where: {
            id: cate_id
          },
          transaction:t
        })
        // 根据分类查询文章
        const article_where = {}
        if(cate){
          // 如果是大分类
          if(cate.parent_id == 0){
            const cates = await ArticleCate.findAll({
              where: {
                parent_id: cate.id
              },
              transaction:t
            })
            // 查询
            return await Article.findAndCountAll({
              include: [{
                model: ArticleCateRel,
                scope: {
                  cate_id: {
                    [Sequelize.Op.in]: cates.map(cate => cate.id)
                  }
                }
              },{
                model: Source,
                as: 'pic'
              }],
              order: [[Sequelize.col('works_count'),'DESC'],[Sequelize.col('collect_count'),'DESC']],
              offset: (page - 1) * limit,
              limit: parseInt(limit),
              transaction:t
            })
          }else{ // 如果小小分类
            return await Article.findAndCountAll({
              include: [{
                model: ArticleCateRel,
                scope: {
                  cate_id: cate.id
                }
              },{
                model: Source,
                as: 'pic'
              }],
              order: [[Sequelize.col('works_count'),'DESC'],[Sequelize.col('collect_count'),'DESC']],
              offset: (page - 1) * limit,
              limit: parseInt(limit),
              transaction:t
            })
          }
        }else{
          return await Article.findAndCountAll({
            include:[{
              model: Source,
              as: 'pic'
            }],
            order: [[Sequelize.col('works_count'),'DESC'],[Sequelize.col('collect_count'),'DESC']],
            offset: (page - 1) * limit,
            limit: parseInt(limit),
            transaction:t
          })
        }
      })()
    })
  }
}