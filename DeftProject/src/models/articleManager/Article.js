const { Article, Admin, ArticleCate, Sequelize } = require('../../migrations/migration')

const moment =  require('moment')

class ArticleModel {
  
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
      title:{
          [Sequelize.Op.like]:`%${others.title}%`
      }
    }

    conditions.include = [{
      model:Admin,
      as:'admin'
    },{
      model:ArticleCate,
      as:'cate',
      where:{
        name:{
          [Sequelize.Op.like]:`%${others.cateName}%`
        }
      }
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


    const data = Article.findAll(conditions);
    return data;
  }

  // 获取
  has(conditions={},excludeId=0){
   return Article.count({
      where:{
        ...conditions,
        id:{
          [Sequelize.Op.notIn]:[excludeId]
        }
      }
    })
  }

  // 更新各状态
  update(values,id){
   return Article.update(values || {} ,{
      where:{
        id:id
      }
    })
  }

  // 获取总数
  totalCount(others={},is_delete = false){
    const conditions = {};
   
    // where条件
    conditions.where = {
      is_delete:is_delete,
      title:{
          [Sequelize.Op.like]:`%${others.title}%`
      }
    }

    conditions.include = [{
      model:Admin,
      as:'admin'
    },{
      model:ArticleCate,
      as:'cate',
      where:{
        name:{
          [Sequelize.Op.like]:`%${others.cateName}%`
        }
      }
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


    const count =  Article.count(conditions);
    return count;
  } 

  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return Article.update({
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
    return Article.destroy({
      where:{
        id:{
          [Sequelize.Op.in]:removeIds
        }
      }
    })
  }

  // 添加管理员
  insert(values){
    return Article.create(values)
  }
  
  // 查询
  findOne(id){
    return Article.findOne({ where:{
      id:id,
      },include:[{
        model:Admin,
        as:'admin'
      },{
        model:ArticleCate,
        as:'cate'
      }]
    })
  }
}


module.exports = new ArticleModel();