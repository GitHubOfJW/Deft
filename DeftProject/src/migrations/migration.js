const force =  false;

const Admin =  require('./Admin')
const Auth = require('./Auth')
const AuthCate = require('./AuthCate')
const Role =  require('./Role')
const AuthRoleRel =  require('./AuthRoleRel')


// 管理关系
Role.hasOne(Admin)

AuthRoleRel.belongsTo(Auth)
AuthRoleRel.belongsTo(Role)

Auth.belongsTo(AuthCate);
AuthCate.hasMany(Auth)

// 创建表
AuthCate.sync({ force:force})
Role.sync({ force:force })
Auth.sync({ force:force})
AuthRoleRel.sync({ force:force})
Admin.sync({ force: force }).then((data)=>{
  Admin.count().then(count => {
    if(count > 0) return;
    Admin.create({
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




const { sequelize, Sequelize } = require('../utils/Squelize')
module.exports = {
  Admin,
  Auth,
  AuthCate,
  Sequelize
}