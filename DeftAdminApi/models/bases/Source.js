// 数据库连接
const { Sequelize,sequelize,force} = require('../../utils/dbConnect')

const { domain } = require('../../config')

const Model = Sequelize.Model

class Source extends Model {

}

//  资源表
Source.init({
    id:{
      type: Sequelize.BIGINT,
      primaryKey:true,
      autoIncrement:true,
      comment: '主键'
    },
    url: {
      type: Sequelize.STRING,
      comment: '资源URL',
      get(){
        const url = this.getDataValue('url')
        if(url){
          return domain + url
        }
        return null
      }
    },
    mimetype: {
      type: Sequelize.STRING(40),
      comment: 'mimetype'
    },
    ext:{
      type: Sequelize.STRING(40),
      comment: '资源的扩展名'
    },
    ref_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: '引用次数'
    },
    is_delete:{
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '是否删除'
    }
},{
  sequelize,
  modelName:'source',
  engine:'Innodb'
})

// 创建
Source.sync({ force: force })

module.exports = {Source,Sequelize,sequelize}