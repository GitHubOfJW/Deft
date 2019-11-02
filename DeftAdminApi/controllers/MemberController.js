const {Member, Sequelize} = require('../models/Member')
const {Role} = require('../models/permission/Role')
const validator = require('validator')
const md5 =  require('md5')
const uuidv4 =  require('uuid/v4')
Member.belongsTo(Role,{
  foreignKey:'role_id',
  constraints:false
})
module.exports =  class MemberController {
  
  // 用户登录
  static async login(ctx, next){
    const {username, password } = ctx.request.body
    // 账号
    if(validator.isEmpty(username)){
      ctx.body = {
        code:5000,
        message:'用户名'
      }
      return
    }else if(validator.isEmpty(password)){
      ctx.body = {
        code:5000,
        message:'失败'
      }
      return
    }else if(!validator.isMobilePhone(username,'zh-CN',false)){
      ctx.body = {
        code:5000,
        username,
        message:'失败'
      }
      return
    }

    // 会员登录返回tokan
    const member = await Member.findOne({
      where:{
        mobile:`${username.trim()}`,
        password:`${md5(md5(password.trim()))}`
      }
    })

    // 获取到账号信息
    if(member){
      const token =  uuidv4()
      member.token =token
      await member.save()
      ctx.session.token = token
      ctx.session.id = member.id
      ctx.body = {
        code:20000,
        message:'成功',
        data:{
          token:token
        }
      }
    }else{ // 未获取到
      ctx.body = {
        code:5000,
        message:'用户名或密码不存在'
      }
    }
  }

  // 获取信息
  static async info(ctx, next){
    const { token } = ctx.request.query
    if(validator.isEmpty(token)){
      ctx.body = {
        code:5000,
        message:'缺少token参数'
      }
      return
    }
    
    // 获取用户信息
    const member = await Member.findOne({
      where:{
        token:token
      },
      include:[{
        model: Role,
      }]
    })

    // 存在
    if(member){
      const role = {}
      if (member.is_admin && !member.role) {
        const { constantRoutes,asyncRoutes} = require('../configs/routes')
        role.role_key = 'admin'
        role.routes = asyncRoutes
        
      }
      ctx.body = {
        code:20000,
        message:'成功',
        data:{
          ...JSON.parse(JSON.stringify(member)),
          role:member.role || role
        }
      }
    }else{
      ctx.body = {
        code:5008,
        message:'账号异常'
      }
    }
  }

  // 退出登录
  static async logout(ctx, next){
    //删除token
    delete ctx.session.token
    ctx.body = {
      code:20000,
      message:'成功'
    }
  }

  // 获取列表
  static async list(ctx, next){
    const page = ctx.query.page || 1
    const limit = ctx.query.limit || 20
    const  { gender = false, mobile = '', name = '', wechat = '', qq = '', sort = '+id' } = ctx.query
    const orders = sort.split(',')
    const orderby = []
    for(let sortItem of orders){
       orderby.push([Sequelize.col(sortItem.substring(1)),sortItem.startsWith('+') ? 'ASC':'DESC'])
    }
    //  查询
    const data = await Member.findAndCountAll({
      attributes:{
        exclude: ['password']
      },
      where:{
        // is_delete: false,
        mobile: {
          [Sequelize.Op.like]: `${ mobile }%`,
        },
        wechat: {
          [Sequelize.Op.like]: `${ wechat }%`,
        },
        qq: { 
          [Sequelize.Op.like]: `${ qq }%`,
        },
        name:{
          [Sequelize.Op.like]: `%${ name }%`,
        },
        gender:{
          [Sequelize.Op.in]:gender < 0 ? [true,false]:[gender==0]
        }
      },
      order:orderby,
      offset: ((page-1) * limit)+0,
      limit: parseInt(limit)
    })

    ctx.body = {
      code: 20000,
      message: '获取成功',
      data: {
        items:data.rows,
        total:data.count
      }
    }
  }

  // 创建管理员
  static async create(ctx, next){
    const  data =  ctx.request.body
    delete data.id
    // 创建
    const result = await Member.create({
      ...data,
      password:md5(md5('123456')),
      token:uuidv4(),
    })

    ctx.body = {
      code:20000,
      message: '创建成功',
      data: {
        id: result.id
      }
    }
  }

  // 修改管理员
  static async update(ctx, next){
    const data =  ctx.request.body
    delete data.is_delete
    delete data.createAt
    delete data.role_key
    delete data.token
    delete data.avatar
    const id = ctx.params.id
    delete data.id

    data.updatedAt = new Date()
    // 修改数据
    await Member.update(data,{
      where: {
        id:id
      }
    })
    ctx.body = {
      code:20000,
      message:'修改成功'
    }
  }

  // 删除
  static async delete(ctx, next) {
    const id = ctx.params.id
    const member = await Member.findOne({
      where: {
        id: ctx.session.id
      }
    })
    if (member.is_admin) {
      ctx.body = {
        code: 50000,
        message: '超级管理员不可删除'
      }
    } else {
      await Member.update({
        is_delete: true
      },{
        where: {
          id: id
        }
      })

      ctx.body = {
        code: 20000,
        message: '删除成功'
      }
    }
  }


  // 删除
  static async recover(ctx, next) {
    const id = ctx.params.id
    const member = await Member.findOne({
      where: {
        id: ctx.session.id
      }
    })
    
    await Member.update({
      is_delete: false
    },{
      where: {
        id: id
      }
    })

    ctx.body = {
      code: 20000,
      message: '恢复成功'
    }
  }
}