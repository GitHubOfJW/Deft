const moment =  require('moment')

const { Auth, AuthCate, Role, AuthRoleRel, Sequelize, sequelize} = require('../../migrations/migration')

class RoleModel {
  
   // 获取数据
  list(page = 1,pagesize = 20,others = {},is_delete = false){
    const conditions = {};
    // 分页
    if(page > 0 && pagesize > 0){
      if(page <= 0){
        page = 1;
      }
      conditions.offset =  (page - 1) * pagesize;
      conditions.limit = pagesize;
    }

    conditions.include = [{
      model:AuthRoleRel,
      include:{
        model:Auth,
        scope:{
          authId:Sequelize.col('authRoleRels.authId')
        }
      },
      where:{
        roleId:Sequelize.col('roles.id')
      }
    }]

    // where条件
    conditions.where = {}
    conditions.where[Sequelize.Op.or] = {
      name:{
        [Sequelize.Op.like]:`%${others.cateName}%`
      }
    }

    // 时间约束
    if(others.start && others.start.trim().length && moment(others.start).isValid()){
      conditions.where.createdAt = {
        [Sequelize.Op.gt]:moment(others.start).toDate()
      }
    }
    if(others.end && others.end.trim().length && moment(others.end).isValid()){
      conditions.where.createdAt = {
        [Sequelize.Op.lt]:moment(others.end).toDate()
      }
    }

    

    const data = Role.findAll(conditions);
    return data;
  }

  // 更新各状态
  update(values,id){
    return sequelize.transaction(function(t){
      const roleValues = { ...values }
      delete roleValues.authIds;

      return Role.update(roleValues,{ where:{ id:id }, transaction:t }).then(result =>{
        return AuthRoleRel.findAll({
          where:{
            roleId:id
          }
        })
      }).then(rels => {
         const relIds = rels.map(relItem=>{
           return relItem.authId;
         })
         console.log(relIds,values.authIds,'查看关系列表')
         const delIds = [];
         const addRels = [];
         
         const idSets = new Set([...relIds,...values.authIds])
         for(let authId of idSets){
           // 不在选中的权限关系里，得删除
           if(!values.authIds.includes(authId)){
              delIds.push(authId)
           }
           // 不在已有的权限关系里，得添加
           if(!relIds.includes(authId)){
              addRels.push({
                authId:authId,
                roleId:id
              })
           }
         }
         console.log(delIds,addRels,'查看数据')

         return Promise.all([
          //  AuthRoleRel.destroy({
          //    where:{
          //      authId:{
          //        [Sequelize.Op.in]:delIds
          //      }
          //    }
          //  }),
           AuthRoleRel.bulkCreate(addRels)
         ])
      })

    })
  }

  // 获取总数
  totalCount(reqCondition={}){
    const count =  Auth.count();
    return count;
  }
  
  // 添加权限
  insert(values){
    return sequelize.transaction(function(t){
      const roleValues = { ...values }
      delete roleValues.authIds;
      return Role.create(roleValues,{transaction:t}).then(role =>{
        const data = [];
        for(let authId of values.authIds){
          data.push({
            roleId:role.id,
            authId:authId
          })
        }
       return AuthRoleRel.bulkCreate(data,{ transaction:t})
      })
    })
  }


  // 查询
  findOne(id){
    return Role.findOne({ where:{
      id:id,
      },include:[{
        model:AuthRoleRel,
        include:{
          model:Auth,
          scope:{
            authId:Sequelize.col('authRoleRels.authId')
          }
        },
        where:{
          roleId:Sequelize.col('roles.id')
        }
      }]
    })
  }
}


module.exports = new RoleModel();