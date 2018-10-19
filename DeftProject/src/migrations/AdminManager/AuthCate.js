const { sequelize, Sequelize } = require('../../utils/Squelize')
const AuthCate = sequelize.define('authCates', {
  name: {
    type: Sequelize.STRING(10),
    allowNull: false,
    comment: '分类名称'
  }
},{
  engine: 'Innodb',//如果要createAt 和updateAt 不能用MYISAM
  createdAt:false,
  updatedAt:false
})
 
module.exports =  AuthCate;