// 数据库连接
const { Sequelize,sequelize,force} = require('../../utils/dbConnect')

const Model = Sequelize.Model

class RoleRuleRel extends Model {

}

// 角色关系
RoleRuleRel.init({
    id:{
      type: Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      comment: '主键'
    },
    role_id:{
      type: Sequelize.INTEGER,
      comment: '角色编号'
    },
    rule_id:{
      type: Sequelize.INTEGER,
      comment: '规则'
    },
    is_delete:{
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '是否删除'
    }
},{
  sequelize,
  modelName:'role_rule_rel',
  timestamps: true,
  engine:'Innodb'
})

// 创建
RoleRuleRel.sync({ force: force })

module.exports = {RoleRuleRel,Sequelize,sequelize}