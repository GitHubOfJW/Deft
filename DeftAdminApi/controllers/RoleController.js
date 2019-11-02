const {Role,Sequelize,sequelize} = require('../models/permission/Role')
const {RoleRuleRel} =  require('../models/permission/RoleRuleRel')
const {Rule} = require('../models/permission/Rule')

const validator = require('validator')
const md5 =  require('md5')
const uuidv4 =  require('uuid/v4')

Role.belongsToMany(Rule, {
  through: RoleRuleRel,
  foreignKey: 'role_id',
  otherKey: 'rule_id',
  as: 'rules',
  constraints: false
})

Rule.belongsToMany(Role, {
  through: RoleRuleRel,
  foreignKey: 'rule_id',
  otherKey: 'role_id',
  as: 'roles',
  constraints: false
})

module.exports =  class RoleController {
   
  // 获取路由
  static async routes(ctx, next){
    const { constantRoutes, asyncRoutes } = require('../configs/routes')
    ctx.body = {
      code: 20000,
      message: '成功',
      data: asyncRoutes
    }
  }

  // 角色
  static async getRoles(ctx, next){
    const data = await Role.findAndCountAll()
    ctx.body = {
      code: 20000,
      message: '成功',
      data: {
        items: data.rows,
        total: data.count
      }
    }
  }

  // 获取列表
  static async list(ctx, next){
    //  查询
    const data = await Role.findAndCountAll({
      // attributes:{
      //   exclude: ['is_delete']
      // },
      include: [{
        model: Rule,
        through: RoleRuleRel,
        as: "rules"
      }],
      // where:{
      //   is_delete: false
      // }
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

  // 创建角色
  static async create(ctx, next){
    const  data =  ctx.request.body
    data.role_key = uuidv4().substring(0,8)
    delete data.id
 
    // 异步执行
    await sequelize.transaction(t=>{
        reuturn (async ()=>{
          // 创建
          const add_role = await Role.create({
            ...data
          },{transaction:t})

          // 判断是否有相关规则数据设置
          if(data.rules){
             // 查询所有rule
             const rules = Rule.findAll({
               where:{
                 id:{
                   [Sequelize.Op.in]: data.rules
                 }
               }
             },{transaction: t})
             // 设置角色
            await add_role.setRules(rules,{transaction: t})
          }

          return true
        })()
    })
    

    ctx.body = {
      code:20000,
      message: '创建成功',
      data: {
        id: result.id,
        role_key: data.role_key
      }
    }
  }

  // 修改角色
  static async update(ctx, next){
    const data =  ctx.request.body
    delete data.is_delete
    delete data.createAt
    delete data.role_id
    delete data.role_key
    delete data.token
    delete data.avatar
    const id = ctx.params.id
    delete data.id

    data.updatedAt = new Date()

    await sequelize.transaction(t=> {
       return (async () => {
         // 首先获取角色的数据
         const update_role = await Role.findOne({
           where: {
             id: id
           }
         },{transaction: t})
         // 然后调用调用修改方法
         update_role.update(data,{transaction:t})
         // 判断是否有rules
         if(data.rules) {
           // 查处所有rules
           const rules = await Rule.findAll({
             where: {
               id: {
                 [Sequelize.Op.in]: data.rules
               }
             }
           },{transaction: t})
           // 设置rules
           await update_role.setRules(rules,{transaction:t})
         }
         return true
       })()
    })

    ctx.body = {
      code:20000,
      message:'修改成功'
    }
  }

   // 删除
   static async delete(ctx, next) {
    const id = ctx.params.id
    await Role.update({
      is_delete: true
    }, {
      where: {
        id: id
      }
    })

    ctx.body = {
      code: 20000,
      message: '删除成功'
    }
  }

  // 删除
  static async recover(ctx, next) {
    const id = ctx.params.id
    await Role.update({
      is_delete: false
    }, {
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