// 数据库连接
const { Sequelize,sequelize,force} = require('../../utils/dbConnect')

const class_json =  require('../../jsons/class.json')

const Model = Sequelize.Model

class Class extends Model {

}

// 班级
Class.init({
    id:{
      type: Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      comment: '主键'
    },
    name: {
      type: Sequelize.STRING(20),
      comment: '名称'
    },
    simple: {
      type: Sequelize.STRING(20),
      comment: '简称'
    },
    min_age: {
      type: Sequelize.SMALLINT,
      defaultValue:0,
      comment: '最小年龄'
    },
    max_age: {
      type: Sequelize.SMALLINT,
      defaultValue:0,
      comment: '最大年龄'
    },
    keywords: {
      type: Sequelize.STRING(100),
      defaultValue: '',
      comment: '关键字'
    },
    sort: {
      type: Sequelize.INTEGER,
      comment: '排序'
    },
    is_delete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '是否删除'
    }
},{
  sequelize,
  modelName:'class',
  timestamps: true,
  engine:'Innodb'
})

// 创建
Class.sync({ force: force }).then( async ()=>{
   const count = await Class.count()
   if(count <= 0){
      await Class.bulkCreate(class_json)
   }
})



module.exports = {Class, Sequelize, sequelize}