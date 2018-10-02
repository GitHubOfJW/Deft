const { Admin ,Sequelize } = require('../../migrations/migration')

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
}


module.exports = new AdminModel();