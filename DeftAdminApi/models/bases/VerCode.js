// 数据库连接
const { Sequelize,sequelize,force} = require('../../utils/dbConnect')

const Model = Sequelize.Model

class VerCode extends Model {

}

//  短信验证码
VerCode.init({
    id:{
      type: Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      comment: '主键'
    },
    mobile: {
      type: Sequelize.STRING(11),
      comment: '手机号'
    },
    code: {
      type: Sequelize.STRING(6),
      comment: '验证码'
    },
    expire_time: {
      type: Sequelize.DATE,
      comment: '过期时间'
    },
    is_delete:{
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '是否删除'
    }
},{
  sequelize,
  modelName:'verification_code',
  engine:'Innodb'
})

// 创建
VerCode.sync({ force: force })

module.exports = {VerCode,Sequelize,sequelize}