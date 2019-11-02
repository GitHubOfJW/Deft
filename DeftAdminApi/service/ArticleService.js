const { Article,Sequelize,sequelize } = require('../models/article/Article')
const { ArticleCate } = require('../models/article/ArticleCate')
const { ArticleLabel } = require('../models/article/ArticleLabel')
const { ArticleLabelRel } =  require('../models/article/ArticleLabelRel')
const { ArticleCateRel } = require('../models/article/ArticleCateRel')
const { ArticleContent } = require('../models/article/ArticleContent')
const { Class } = require('../models/class/Class')
const { Member } = require('../models/Member')

ArticleContent.belongsTo(Member,{
  foreignKey: 'author_id',
  constraints: false
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


const fileTool = require('../utils/fileTool')
module.exports = class ArticleService {


  // 所有分类
  static async allCates() {
    const data = await ArticleCate.findAndCountAll()
    return data
  }

  // 所有标签
  static async alllabels() {
    const data = await ArticleLabel.findAndCountAll()
    return data
  }

  // 文章分类
  static async cateList({ page = 1, limit = 20, name = '', path = '', parent_id = 0, sort = '+sort' }){
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
    const data = await ArticleCate.findAndCountAll({
      where:where,
      order:orderby,
      offset: ((page-1) * limit)+0,
      limit: parseInt(limit)
    })

    return data
  }

  // 添加文章
  static async cateAdd(body = {}) {
    if(body.icon) {
      body.icon = fileTool.removeFileFlag(body.icon)
    }
    const result = await ArticleCate.create(body)
    return result.id
  }

  // 修改
  static async cateEdit(body = {},id = 0) {
    const cate = await ArticleCate.findOne({
      where: {
        id: id
      }
    })
    // 旧链接加标记
    if(cate && cate.icon && body.icon && cate.icon !== body.icon) {
      fileTool.addFileFlag(cate.icon)
      body.icon = fileTool.removeFileFlag(body.icon)
    }

    delete body.createdAt
    delete body.updatedAt
    delete body.sort
    delete body.is_delete

    // 更新
    const result = await ArticleCate.update(body,{
      where: {
        id: id
      }
    })
    return result
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
  static async articleList({ page = 1, limit = 20, title = '', path = '', parent_id = 0, sort = '+sort' }){
    const orders = (sort).split(',')
    const orderby = []
    for(let sortItem of orders){
        orderby.push([Sequelize.col(sortItem.substring(1)),sortItem.startsWith('+') ? 'ASC':'DESC'])
    }

    const where = {
      title: {
        [Sequelize.Op.like]: `%${ title }%`,
      }
    }

    //  查询
    const data = await Article.findAndCountAll({
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
      }],
      order:orderby,
      offset: ((page-1) * limit)+0,
      limit: parseInt(limit)
    })

    return data
  }

  // 添加文章
  static async articleAdd(body = {}) {
    
    if(body.pic_url) {
      body.pic_url = fileTool.removeFileFlag(body.pic_url)
    }

    return sequelize.transaction(t => {
      return (async () => {
        // 创建文章
        const add_article = await Article.create(body,{
          transaction:t
        })
        // 更新计数
        await ArticleCate.update({count:sequelize.literal('`count` +1')}, {
          where: {
            id: {
              [Sequelize.Op.in]: body.cate_ids || []
            }
          }
        },{transaction:t})

        // 设置文章对应的分类
        if(body.cate_ids){
          const cates = await ArticleCate.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: body.cate_ids || []
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

        
        // 旧链接加标记 这里跟事务有可能不同步，可能会有问题
        if(edit_article && edit_article.pic_url && body.pic_url && edit_article.pic_url !== body.pic_url) {
          fileTool.addFileFlag(edit_article.pic_url)
          body.pic_url = fileTool.removeFileFlag(body.pic_url)
        }

        // 更新计数
        const ids = edit_article.articlecates.map(item => item.id)

        await ArticleCate.update({count:sequelize.literal('`count` -1')}, {
          where: {
            id: {
              [Sequelize.Op.in]: ids
            }
          }
        },{transaction:t})

        await ArticleCate.update({count:sequelize.literal('`count` +1')}, {
          where: {
            id: {
              [Sequelize.Op.in]: body.cate_ids || []
            }
          }
        },{transaction:t})

        // 更新
        edit_article.update(body,{ transaction: t })

        // 设置文章对应的分类
        if(body.cate_ids){
          const cates = await ArticleCate.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: body.cate_ids || []
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


  // 文章内容相关

  // 内容
  static async contentList({ page = 1, limit = 20, aritcle_id  = 0 }){
    const where = {
    }
    if(aritcle_id > 0 ){
      where.id =  aritcle_id
    }

    //  查询
    const data = await ArticleContent.findAndCountAll({
      where:where,
      include:{
        model: Member,
        attributes: {
          include:['name']
        }
      },
      offset: (page - 1) * limit,
      limit: parseInt(limit)
    })
    return data
  }

  // 添加内容
  static async contentAdd(body = {}) {
    const result = await ArticleContent.create(body)
    return result.id
  }

  // 修改
  static async contentEdit(body = {},id = 0) {
    const content = await ArticleContent.findOne({
      where: {
        id: id
      }
    })
    
    delete body.createdAt
    delete body.updatedAt
    delete body.sort
    delete body.is_delete

    // 更新
    const result = await ArticleContent.update(body,{
      where: {
        id: id
      }
    })
    return result
  }

  // 删除
  static async contentDelete(id = 0 ) {
    // 删除
    const result = await ArticleContent.update({
      is_delete: true
    }, {
      where: {
        id: id
      }
    })
    return result
  }

  // 恢复
  static async contentRecover(id = 0) {
    const result = await ArticleContent.update({
      is_delete: false
    }, {
      where: {
        id:id
      }
    })
    return result
  }
}