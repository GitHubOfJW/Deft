// 数据库连接
const { Sequelize,sequelize,force} = require('../../utils/dbConnect')

const Model = Sequelize.Model

class ArticleContent extends Model {

}

// 饮食分类
ArticleContent.init({
    id:{
      type: Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      comment: '主键'
    },
    author_id: {
      type: Sequelize.INTEGER,
      comment: '作者id'
    },
    article_id: {
      type: Sequelize.INTEGER,
      comment: '文章id'
    },
    rich_content: {
      type: Sequelize.TEXT,
      comment: '内容'
    },
    sort: {
      type: Sequelize.INTEGER,
      comment: '排序'
    },
    is_delete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '是否删除'
    }
},{
  sequelize,
  modelName:'article_content',
  timestamps: true,
  engine:'Innodb'
})

// 创建
ArticleContent.sync({ force: force })

module.exports = {ArticleContent, Sequelize, sequelize}