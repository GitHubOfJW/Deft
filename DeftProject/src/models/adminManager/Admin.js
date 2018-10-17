const { Admin, Role, Sequelize } = require('../../migrations/migration')

const moment =  require('moment')

class AdminModel {
  
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
    // where条件
    conditions.where = {
      is_delete:is_delete,
      [Sequelize.Op.and]:[{
        [Sequelize.Op.or]:{
          mobile:{
            [Sequelize.Op.like]:`%${others.contact}%`
          },
          email:{
            [Sequelize.Op.like]:`%${others.contact}%`
          }
        }
      },
      {
        [Sequelize.Op.or]:{
          name:{
            [Sequelize.Op.like]:`%${others.username}%`
          },
          account:{
            [Sequelize.Op.like]:`%${others.username}%`
          }
        }
      }]
    }

    conditions.include = [{
      model:Role
    }]
    
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


    const data = Admin.findAll(conditions);
    return data;
  }

  // 获取
  has(conditions={}){
   return Admin.count({
      where:{
        ...conditions
      }
    })
  }

  // 更新各状态
  update(values,id){
   return Admin.update(values || {} ,{
      where:{
        id:id
      }
    })
  }

  // 获取总数
  totalCount(reqCondition={}){
    const count =  Admin.count();
    return count;
  }
   
  adminLogin(account,password){
    // 查询admin
    let admin =  Admin.findOne({
      attributes:{ exclude:['password'] },
      where:{
        [Sequelize.Op.or]:{
          account: account,
          mobile: account,
          email: account
        },
        password:password
      }
    });

    return admin;
  }
  
  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return admin.update({
      is_delete:!reverse
    },{
      where:{
        id:{
          [Sequelize.Op.in]:deleteIds
        }
      }
    })
  }

  // 彻底删除
  removeByIds(ids = []){
    const removeIds =  [...(ids||[])]
    return Admin.destroy({
      where:{
        id:{
          [Sequelize.Op.in]:removeIds
        }
      }
    })
  }

  // 添加管理员
  insert(values){
    return Admin.create(values)
  }
  
  // 查询
  findOne(id){
    return Admin.findOne({ where:{
      id:id,
      },include:[{
        model:Role
      }]
    })
  }
}


module.exports = new AdminModel();