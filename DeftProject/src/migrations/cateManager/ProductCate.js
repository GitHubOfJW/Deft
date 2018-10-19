const { sequelize, Sequelize } = require('../../utils/Squelize')
const moment = require('moment')
const ProductCate = sequelize.define('productCate', {
  name: { 
    type: Sequelize.STRING(20),
    allowNull: false,
    comment: '商品型名称'
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

module.exports =  ProductCate