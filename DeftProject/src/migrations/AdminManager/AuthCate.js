const { sequelize, Sequelize } = require('../../utils/Squelize')
const moment = require('moment')
const AuthCate = sequelize.define('authCates', {
  name: {
    type: Sequelize.STRING(10),
    allowNull: false,
    comment: '分类名称'
  }
},{
  getterMethods:{
    createdTime(){
      const time =  this.getDataValue('createdAt');
      return  moment(time).format('YYYY-MM-DD HH:mm:ss');
    },
    updatedTime(){
      const time =  this.getDataValue('updatedAt');
      return  moment(time).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  engine: 'Innodb'
})
 
module.exports =  AuthCate;