const { sequelize, Sequelize } = require('../utils/Squelize')
const Auth = sequelize.define('auths', {
  name: {
    type: Sequelize.STRING(10),
    allowNull: false,
    comment: '权限名称'
  },
  rules: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: '规则'
  },
  // cate_id: {
  //   type:Sequelize.INTEGER,
  //   allowNull: false,
  //   comment: '权限分类'
  // },
  remark: {
    type:Sequelize.TEXT,
    allowNull: true,
    comment: '权限分类'
  }
},{
  engine: 'Innodb',//如果要createAt 和updateAt 不能用MYISAM
  createdAt:false,
  updatedAt:false
})

module.exports = Auth