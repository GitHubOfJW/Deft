// 数据库连接
const { Sequelize,sequelize,force} = require('../../utils/dbConnect')

const Model = Sequelize.Model

class Banner extends Model {

}

// 首页Banner
Banner.init({
    id:{
      type: Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      comment: '主键'
    },
    banner_id: {
      type: Sequelize.BIGINT,
      comment: '图标'
    },
    platform: {
      type: Sequelize.TINYINT,
      comment: '平台 0 微信小程序 1 app/h5'
    },
    url: {
      type: Sequelize.STRING(255),
      comment: 'url地址，用于跳转web'
    },
    router: {
      type: Sequelize.STRING(255),
      comment: '路由',
    },
    memeber_id: {
      type: Sequelize.INTEGER,
      comment: '添加者id'
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
  modelName:'banners',
  timestamps: true,
  engine:'Innodb'
})

// 创建
Banner.sync({ force: force })

module.exports = {Banner, Sequelize, sequelize}