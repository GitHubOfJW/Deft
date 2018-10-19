const { sequelize, Sequelize } = require('../../utils/Squelize')
const AuthRoleRel = sequelize.define('authRoleRel', {
},{
  engine: 'Innodb',//如果要createAt 和updateAt 不能用MYISAM
  createdAt:false,
  updatedAt:false
})
 
module.exports =  AuthRoleRel;