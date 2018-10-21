const { ArticleCate, Auth, AuthRoleRel, Sequelize, sequelize } = require('../../migrations/migration')

const moment =  require('moment')

class ArticleCateModel {
  
   // 获取数据
  list(page = 1,pagesize = 20){
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
      model:ArticleCate,
      as:'children',
      include:{
        model:ArticleCate,
        as:'father'
      }
    }]
    
    conditions.where = {
      pid:null
    }
    
    const data = ArticleCate.findAll(conditions);
    return data;
  }

  // 更新各状态
  update(values,id){
   return ArticleCate.update(values || {} ,{
      where:{
        id:id
      }
    })
  }

  // 获取总数
  totalCount(others={}){
    const count =  ArticleCate.count({
      where:{
        pid:null
      }
    });
    return count;
  }

  // 添加分类
  insert(values){
    return ArticleCate.create(values)
  }

  // 彻底删除
  removeByIds(ids = []){
    const removeIds =  [...(ids||[])]
    return ArticleCate.destroy({
      where:{
        id:{
          [Sequelize.Op.in]:removeIds
        }
      }
    })
  }
  
}


module.exports = new ArticleCateModel();