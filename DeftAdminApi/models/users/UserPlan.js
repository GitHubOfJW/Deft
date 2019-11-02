// 数据库连接
const { Sequelize,sequelize,force} = require('../../utils/dbConnect')

const Model = Sequelize.Model

class User extends Model {

}
// 用户计划信息标
User.init({
    id:{
      type: Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      comment: '主键'
    },
    has_plan: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '当前是否有计划'
    },
    reset_plan: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: '重置计划次数'
    },
    user_id: {
      type: Sequelize.INTEGER,
      comment: '用户编号'
    },
    is_delete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '是否删除'
    }
},{
  sequelize,
  modelName:'user',
  timestamps: true,
  engine:'Innodb'
})

// 创建
User.sync({ force: force })

module.exports = {User, Sequelize, sequelize}