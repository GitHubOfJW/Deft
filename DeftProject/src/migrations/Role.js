const { sequelize, Sequelize } = require('../utils/Squelize')
const moment = require('moment')
const Role = sequelize.define('roles', {
  name: {
    type: Sequelize.STRING(10),
    allowNull: false,
    comment: '角色名称'
  },
  remark: {
    type:Sequelize.TEXT,
    allowNull: true,
    comment: '角色备注'
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

module.exports = Role