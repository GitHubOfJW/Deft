const { sequelize, Sequelize } = require('../../utils/Squelize')
const moment = require('moment')
const ArticleCate = sequelize.define('articleCate', {
  name: { 
    type: Sequelize.STRING(20),
    allowNull: false,
    comment: '文章类型名称'
  },
  enable: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '是否启用'
  },
  sort: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: '1',
    comment: '排序'
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
  engine: 'Innodb',//如果要createAt 和updateAt 不能用MYISAM
})

module.exports =  ArticleCate