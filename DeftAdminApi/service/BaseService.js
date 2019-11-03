const { User, Sequelize } = require('../models/users/User')
const { md5_password } = require('../utils/Encryption')
const moment =  require('moment')
const uuid = require('uuid/v4')
const { VerCode } = require('../models/bases/VerCode')
const { Source } = require('../models/bases/Source')

module.exports = class BaseService {
  // 验证验证码
  static async checkCode(mobile, code){
    const success = await VerCode.count({
      where: {
        mobile: mobile.trim(),
        code: code.trim(),
        [Sequelize.Op.lt]: moment().toDate()
      }
    })
    return success > 0
  }

  // 发送验证码
  static async sendVerCode(mobile) {
    let index = 0
    const arr = []
    while(index < 6){
      const val = Math.floor(Math.random() * 10)
      arr.push(val)
      index ++
    }
    // 创建验证码
    const result = await VerCode.create({
      mobile:mobile,
      code:arr.join(''),
      expire_time: moment().add('second', 70)
    })

    // 调用发送短信功能

    return true
  }


  // 累计资源
  static async sourceIncrement(id=0){
    return Source.update({count:sequelize.literal('`count` +1')}, {
      where: {
        id: id
      }
    })
  }

  // 减少计数
  static async sourceDecrement(id=0){
    return Source.update({count:sequelize.literal('`count` -1')}, {
      where: {
        id: {
          [Sequelize.Op.in]: ids
        }
      }
    })
  }

  // 添加资源
  static async sourceAdd(body = {}){
    body.ref_count =  0
    body.ext = body.mimetype.substring(body.mimetype.indexOf('/')+1)
    return Source.create(body)
  }

  // 删除资源
  static async sourceDelete(id = 0){
    return Source.update({
      is_delete: true,

    },{
      where: {
        id: id
      }
    })
  }

  // 恢复
  static async sourceRecover(id = 0){
    return Source.update()
  }
}