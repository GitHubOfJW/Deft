const { sequelize, Sequelize } = require('../../utils/Squelize')

const moment =  require('moment')

class Auth {
  
  //配置映射
   constructor(){
      this.instance = sequelize.define('tbl_auth', {
        name: {
          type: Sequelize.STRING(10),
          allowNull: false,
          comment: '权限名称'
        },
        rules: {
          type: Sequelize.TEXT,
          allowNull: false,
          comment: '规则'
        },
        cate_id: {
          type:Sequelize.INTEGER,
          allowNull: false,
          comment: '权限分类'
        },
        remark: {
          type:Sequelize.TEXT,
          allowNull: true,
          comment: '权限分类'
        }
      },{
        engine: 'Innodb',//如果要createAt 和updateAt 不能用MYISAM
        createdAt:false,
        updatedAt:false
      })
       
      this.instance.sync({ force: false })
   }

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


    const data = this.instance.findAll(conditions);
    return data;
  }

  // 更新各状态
  update(values,id){
   return this.instance.update(values || {} ,{
      where:{
        id:id
      }
    })
  }

  // 获取总数
  totalCount(reqCondition={}){
    const count =  this.instance.count();
    return count;
  }
  
  // 添加权限
  insert(values){
    return this.instance.create(values)
  }
}


module.exports = new Auth();