const { sequelize, Sequelize } = require('../../utils/Squelize')
const moment = require('moment')
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
  remark: {
    type:Sequelize.TEXT,
    allowNull: true,
    comment: '备注'
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

module.exports = Auth