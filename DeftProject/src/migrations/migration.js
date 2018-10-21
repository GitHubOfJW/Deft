const force =  false;

const Admin =  require('./adminManager/Admin')
const Auth = require('./adminManager/Auth')
const AuthCate = require('./adminManager/AuthCate')
const Role =  require('./adminManager/Role')
const AuthRoleRel =  require('./adminManager/AuthRoleRel')

const ArticleCate = require('./CateManager/ArticleCate')
const ProductCate = require('./CateManager/ProductCate')


// 管理关系
Admin.belongsTo(Role)
Auth.hasOne(AuthRoleRel)
AuthRoleRel.belongsTo(Auth,{
  constraints:false
})
Role.hasMany(AuthRoleRel)

Auth.belongsTo(AuthCate);
AuthCate.hasMany(Auth)


// 产品分类 和 文章分类
ArticleCate.belongsTo(ArticleCate, { foreignKey:'pid', as:'father'})
ProductCate.belongsTo(ProductCate, { foreignKey:'pid', as:'father'})

ArticleCate.hasMany(ArticleCate,{ foreignKey:'pid', as:'children'})
ProductCate.hasMany(ProductCate,{ foreignKey:'pid', as:'children'})

// 创建表
AuthCate.sync({ force:force })
Role.sync({ force:force })
Auth.sync({ force:force })
AuthRoleRel.sync({ force:force })
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
// 产品分类 和 文章分类
ArticleCate.sync({ force:force })
ProductCate.sync({ force:force })


const { sequelize, Sequelize } = require('../utils/Squelize')
module.exports = {
  Admin,
  Role,
  Auth,
  AuthCate,
  AuthRoleRel,
  ArticleCate,
  ProductCate,
  Sequelize,
  sequelize
}