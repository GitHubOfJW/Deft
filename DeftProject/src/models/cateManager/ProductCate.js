const { ProductCate, Auth, AuthRoleRel, Sequelize, sequelize } = require('../../migrations/migration')

const moment =  require('moment')

class ProductCateModel {
  
   // 获取数据
  list(page = 1,pagesize = 20,is_delete = false){
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
      model:ProductCate,
      as:'children',
      include:{
        model:ProductCate,
        as:'father'
      }
    }]
    
    conditions.where = {
      pid:null,
      is_delete:is_delete
    }
    
    const data = ProductCate.findAll(conditions);
    return data;
  }

  // 更新各状态
  update(values,id){
   return ProductCate.update(values || {} ,{
      where:{
        id:id
      }
    })
  }

  // 获取总数
  totalCount(others={}){
    const count =  ProductCate.count({
      where:{
        pid:null
      }
    });
    return count;
  }

  // 添加分类
  insert(values){
    return ProductCate.create(values)
  }

  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return ProductCate.update({
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
    return ProductCate.destroy({
      where:{
        id:{
          [Sequelize.Op.in]:removeIds
        }
      }
    })
  }
  
}


module.exports = new ProductCateModel();