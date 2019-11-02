// 数据库连接
const { Sequelize,sequelize,force} = require('../../utils/dbConnect')

const Model = Sequelize.Model

class ArticleLabelRel extends Model {

}

// 标签
ArticleLabelRel.init({
    id:{
      type: Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      comment: '主键'
    },
    article_id: {
      type: Sequelize.INTEGER,
      unique: true,
      comment: '文章id'
    },
    label_id: {
      type: Sequelize.INTEGER,
      unique: true,
      comment: '标签id'
    },
    is_delete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '是否删除'
    }
},{
  sequelize,
  modelName:'article_label_rel',
  timestamps: true,
  engine:'Innodb'
})

// 创建
ArticleLabelRel.sync({ force: force })

module.exports = {ArticleLabelRel, Sequelize, sequelize}