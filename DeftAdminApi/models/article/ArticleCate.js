// 数据库连接
const { Sequelize,sequelize,force} = require('../../utils/dbConnect')

const Model = Sequelize.Model

class ArticleCate extends Model {

}

// 饮食分类
ArticleCate.init({
    id:{
      type: Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      comment: '主键'
    },
    app_icon: {
      type: Sequelize.STRING(40),
      comment: '图标名'
    },
    icon: {
      type: Sequelize.STRING(100),
      comment: '图标'
    },
    name: {
      type: Sequelize.STRING(20),
      comment: '名称'
    },
    pinyin: {
      type: Sequelize.STRING(50),
      comment: '拼音'
    },
    count: {
      type: Sequelize.SMALLINT,
      defaultValue: 0,
      comment: '数量'
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
  modelName:'article_cate',
  timestamps: true,
  engine:'Innodb'
})

// 创建
ArticleCate.sync({ force: force })

module.exports = {ArticleCate, Sequelize, sequelize}