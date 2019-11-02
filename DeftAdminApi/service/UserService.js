const { User, Sequelize } = require('../models/users/User')
const { md5_password } = require('../utils/Encryption')
const BaseService =  require('../service/BaseService')
const MetaService = require('../service/MetaService')
const uuid = require('uuid/v4')
module.exports = class UserService {
  // 用户名密码登录
  static async login({mobile,password,code, type = 1}){
    // 获取用户
    const exit_user = await User.findOne({
      where:{
        mobile: mobile.trim()
      }
    })
    // 如果用户存在则判断密码
    if(exit_user) {
      // 密码相同则返回token
      if(type === 1 && exit_user.password === md5_password(password.trim())) {
        return {
          code: 0,
          message:'成功',
          data: {
            token: exit_user.token
          }
        }
      }else if(type === 2) { // 短信
        const result = await BaseService.checkCode(mobile,code)
        if(result){
          return {
            code: 0,
            message:'成功',
            data: {
              token: exit_user.token
            }
          } 
        }else{
          return {
            code: 500,
            message: '验证码错误'
          }
        }
      }
      return {
        code: 500,
        message: '用户名或密码不存在'
      }
    }else{
      // 创建用户
      const uuid = uuid()
      await User.create({
        mobile: mobile.trim(),
        password: md5_password(password.trim()),
        token: uuid
      })
      return {
        code: 0,
        message:'成功',
        data: {
          token: exit_user.token
        }
      }
    }
  }

  // 根据id 修改
  static async update(body = {},id ) {
    return await User.update(body,{
      where: {
        id:id
      }
    })
  }

  // 获取计划个人资料设定
  static async getPlanRefer() {
    const fat_reasons = await MetaService.getFat_reasons()
    const reduce_tiems = await MetaService.getReduce_times()
    const refres  = []
    refres.push({
      title: '肥胖成因',
      labels: fat_reasons,
      tag: 0
    })
    refres.push({
      title: '近两年减肥次数',
      labels: reduce_tiems,
      tag: 1
    })
    refres.push({
      title: '是否会游泳(能够使用一种泳姿连续游两百米以上)',
      tag: 2,
      labels: [{
        value: 0,
        name: '是'
      },{
        value: 1,
        name: '否'
      }]
    })

    return refres
  }

  // 获取计划个人资料设定
  static async getPlanRefer1() {
    const refres  = []
    refres.push({
      title: '单次最长跑步距离（一年内）',
      labels: [],
      tag: 3
    })
    refres.push({
      title: '可接受的运动强度',
      tag: 4,
      labels: [{
        value: 0,
        name: '初级',
        prompt: '每周不少于2次'
      },{
        value: 1,
        name: '中级',
        prompt: '3～5次/周'
      },{
        value: 2,
        name: '高强度',
        prompt: '每周运动5次以上'
      }]
    })

    const days = []
    for(let i = 1;i <= 7;i++){
      days.push({
        value: i%7,
        name: `${i}`
      })
    }
    refres.push({
      title: "固定运动日",
      tag: 5,
      prompt: "每周不少于2次",
      labels: days
    })

    refres.push({
      title: "固定运动日",
      tag: 6,
      prompt: "每周不少于2次",
      labels: days
    })

    refres.push({
      title: '一下动作您属于',
      tag: 7,
      labels: [{
        value: 0,
        name: '低'
      },{
        value: 1,
        name: '中'
      },{
        value: 2,
        name: '高'
      }]
    })



    return refres
  } 
}