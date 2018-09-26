const { sequelize, Sequelize } = require('../../utils/Squelize')


class Admins {
  
  //配置映射
   constructor(){
      this.instance = sequelize.define('tbl_admins', {
        account: { 
          type: Sequelize.STRING(20),
          allowNull: false,
          comment: '账户名'
        },
        name: {
          type: Sequelize.STRING(10),
          allowNull: false,
          comment: '真实姓名'
        },
        password: {
          type: Sequelize.STRING(20),
          allowNull: false,
          comment: '密码'
        },
        mobile: {
          type: Sequelize.STRING(11),
          allowNull: false,
          comment: '手机号'
        },
        email: {
          type:Sequelize.STRING(30),
          allowNull: true,
          comment: '邮箱'
        },
        role_id: {
          type:Sequelize.INTEGER,
          allowNull: true,
          comment: '角色'
        },
        is_admin: {
          type:Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue:false,
          comment: '超级管理员'
        },
        enable: {
          type:Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          comment: '启用/禁用'
        },
        is_delete: {
          type:Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: '删除'
        }
      },{
        engine: 'Innodb'//如果要createAt 和updateAt 不能用MYISAM
      })
       
      this.instance.sync({ force: false }).then((data)=>{
        this.instance.count().then(count => {
          if(count > 0) return;
          this.instance.create({
            account: 'zhujianwei',
            name: '朱建伟',
            password: 'zhujianwei',
            mobile: '13311255165',
            email: '1284627282@qq.com',
            role_id: null,
            is_admin: true,
            enable: true,
            is_delete: false
          })
        })
      })
   }

   // 获取数据
  list(page = 1,pagesize = 20,others = {},is_delete = false){
    const conditions = {};
    // 分页
    if(page && pagesize){
      if(page <= 0){
        page = 1;
      }
      conditions.offset =  (page - 1) * pagesize;
      conditions.limit = pagesize;
    }

    conditions.where = {
      is_delete:is_delete
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
   
  adminLogin(account,password){
    // 查询admin
    let admin =  this.instance.findOne({
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


module.exports = new Admins();