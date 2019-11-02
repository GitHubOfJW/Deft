// 数据库连接
const { Sequelize,sequelize,force} = require('../../utils/dbConnect')

const Model = Sequelize.Model

class Article extends Model {

}

// 文章
Article.init({
    id:{
      type: Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      comment: '主键'
    },
    pic_url: {
      type: Sequelize.STRING,
      comment: '配图'
    },
    video_url:{
      type: Sequelize.STRING,
      comment: '视频'
    },
    title: {
      type: Sequelize.STRING(10),
      comment: '标题'
    },
    min_age:{
      type: Sequelize.SMALLINT,
      defaultValue: 0,
      comment: '最小适合年龄'
    },
    max_age: {
      type: Sequelize.SMALLINT,
      defaultValue: 300,
      comment: '最大适合年龄 300默认，外星人不考虑'
    },
    gender: {
      type: Sequelize.TINYINT,
      defaultValue: 0,
      comment: '0 通用 1男孩 2 女孩'
    },
    importance: {
      type: Sequelize.TINYINT,
      defaultValue: 1,
      comment: '文章的重要性'
    },
    is_finished: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '是否完成'
    },
    is_recommend: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '推荐'
    },
    support_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: '点赞量'
    },
    collect_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: '收藏量'
    },
    view_count:{
      type: Sequelize.BIGINT,
      defaultValue: 0,
      comment: '阅读量'
    },
    works_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: '作品量，通过文章添加自己的作品'
    },
    is_works: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      comment: '是否可以添加作品'
    },
    sku_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: '关联的商品数'
    },
    sort: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: '排序'
    },
    is_delete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '是否删除'
    }
},{
  sequelize,
  modelName:'article',
  timestamps: true,
  engine:'Innodb'
})

// 创建
Article.sync({ force: force })

module.exports = {Article, Sequelize, sequelize}