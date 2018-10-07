const { AuthCate, Auth, Sequelize } = require('../../migrations/migration')

const moment =  require('moment')

class AuthCateModel {
  
   // 获取数据
  list(page = 1,pagesize = 20,includeAuth = false){
    const conditions = {};
    // 分页
    if(page > 0 && pagesize > 0){
      if(page <= 0){
        page = 1;
      }
      conditions.offset =  (page - 1) * pagesize;
      conditions.limit = pagesize;
    }

    if(includeAuth){
      conditions.include = [{
        model:Auth,
        where:{
          authCateId:Sequelize.col('authCates.id')
        }
      }]
    }
    
    const data = AuthCate.findAll(conditions);
    return data;
  }

  // 更新各状态
  update(values,id){
   return AuthCate.update(values || {} ,{
      where:{
        id:id
      }
    })
  }

  // 获取总数
  totalCount(reqCondition={}){
    const count =  AuthCate.count();
    return count;
  }

  // 添加分类
  insert(values){
    return AuthCate.create(values)
  }
}


module.exports = new AuthCateModel();