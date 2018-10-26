const { sequelize, Sequelize } = require('../../utils/Squelize')
const moment = require('moment')
const Article = sequelize.define('articles', {
  title: {
    type: Sequelize.STRING(10),
    allowNull: false,
    comment: '文章名称'
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: '文章内容'
  },
  collect: {
    type: Sequelize.BIGINT,
    allowNull: false,
    defaultValue:'0',
    comment: '收藏数'
  },
  support: {
    type: Sequelize.BIGINT,
    allowNull: false,
    defaultValue:'0',
    comment: '点赞数'
  },
  inspects: {
    type: Sequelize.BIGINT,
    allowNull: false,
    defaultValue:'0',
    comment: '浏览记录'
  },
  rewards: {
    type: Sequelize.BIGINT,
    allowNull: false,
    defaultValue:'0',
    comment: '打赏次数'
  },
  cate_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '分类id'
  },
  admin_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '管理员id'
  },
  member_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '用户id'
  },
  is_delete: {
    type:Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '删除'
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

module.exports =  Article