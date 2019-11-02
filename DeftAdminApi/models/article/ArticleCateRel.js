// 数据库连接
const { Sequelize,sequelize,force} = require('../../utils/dbConnect')

const Model = Sequelize.Model

class ArticleCateRel extends Model {

}

// 标签
ArticleCateRel.init({
    id:{
      type: Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      comment: '主键'
    },
    article_id: {
      type: Sequelize.INTEGER,
      unique: true,
      comment: '饮食id'
    },
    cate_id: {
      type: Sequelize.INTEGER,
      unique: true,
      comment: '分类id'
    },
    is_delete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '是否删除'
    }
},{
  sequelize,
  modelName:'article_cate_rel',
  timestamps: true,
  engine:'Innodb'
})

// 创建
ArticleCateRel.sync({ force: force })

module.exports = {ArticleCateRel, Sequelize, sequelize}