// 数据库连接
const { Sequelize,sequelize,force} = require('../../utils/dbConnect')

const Model = Sequelize.Model

class Notice extends Model {

}

// 计划通知
Notice.init({
    id:{
      type: Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      comment: '主键'
    },
    name: {
      type: Sequelize.STRING(10),
      comment: '通知名称'
    },
    time: {
      type: Sequelize.STRING(10),
      comment: '时间（00:00）'
    },
    open: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      comment: '开关'
    },
    tag: {
      type: Sequelize.TINYINT,
      defaultValue: 0,
      comment: '标记类型'
    },
    parent_id: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: '记录'
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
  timestamps: true,
  modelName:'plan_notice',
  engine:'Innodb'
})

// 创建
Notice.sync({ force: force })

module.exports = {Notice, Sequelize, sequelize}