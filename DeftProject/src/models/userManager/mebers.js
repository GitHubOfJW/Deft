const { sequelize, Sequelize } = require('../../utils/Squelize')


class Members {
  
  //配置映射
   constructor(){
      this.instance = sequelize.define('tbl_members', {
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
        engine: 'MYISAM',
        createdAt: false,
        updatedAt: false
      })
       
      this.instance.sync({ force: false }).then(()=>{
        console.log("创建成功")
        return this.instance.create({
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
   }

   // 获取数据
  list(){
    let data = this.instance.findAll();
    return data;
  }
   
  memberLogin(account,password){
    // 查询member
    let member =  this.instance.findOne({
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

    return member;
  }
}


module.exports = new Members();