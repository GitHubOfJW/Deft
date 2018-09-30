const { sequelize, Sequelize } = require('../../utils/Squelize')

const moment =  require('moment')

class AuthCate {
  
  //配置映射
   constructor(){
      this.instance = sequelize.define('tbl_authCate', {
        name: {
          type: Sequelize.STRING(10),
          allowNull: false,
          comment: '分类名称'
        }
      },{
        engine: 'Innodb',//如果要createAt 和updateAt 不能用MYISAM
        createdAt:false,
        updatedAt:false
      })
       
      this.instance.sync({ force: false })
   }

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

  // 添加分类
  insert(values){
    return this.instance.create(values)
  }
}


module.exports = new AuthCate();