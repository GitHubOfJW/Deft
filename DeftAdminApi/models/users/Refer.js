// 数据库连接
const { Sequelize,sequelize,force} = require('../../utils/dbConnect')

const Model = Sequelize.Model

class Refer extends Model {

}
// 用户身体参考表
Refer.init({
    id:{
      type: Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      comment: '主键'
    },
    orgin_height:{
      type: Sequelize.SMALLINT,
      comment: '初始身高（cm）'
    },
    orgin_weight: {
      type: Sequelize.SMALLINT,
      comment: '初始体重 (kg)'
    },
    curr_weight: {
      type: Sequelize.SMALLINT,
      comment: '当前体重 (kg)'
    },
    dest_weight: {
      type: Sequelize.SMALLINT,
      comment: '目标体重 (kg)'
    },
    age: {
      type: Sequelize.SMALLINT,
      defaultValue: 0,
      comment: '目标体重 (kg)'
    },
    gender: {
      type: Sequelize.TINYINT,
      comment: '性别'
    },
    heredity_fat: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
      comment: '遗传肥胖'
    },
    fat_level: {
      type: Sequelize.ENUM,
      values: [0,1,2],
      defaultValue: 0,
      comment: '0 轻度 1 中度 2 重度'
    },
    intensity: {
      type: Sequelize.ENUM,
      values: [0,1,2],
      comment: '0一般 1中等 2强'
    },
    reduce_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: '近两年减肥次数'
    },
    flexibilit: {
      type: Sequelize.ENUM,
      values: [0,1,2],
      comment: "0一般 1良好 2优秀"
    },
    break_time: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: '休息时间'
    },
    weekly_swims: {
      type: Sequelize.TINYINT,
      defaultValue: 0,
      comment: '一周游泳次数'
    },
    can_swim: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '是否会游泳'
    },
    swim_posture: {
      type: Sequelize.STRING(100),
      set(value) {
        let val = value
        if(val){
          val = val.replace('，',',')
        }
        this.setDataValue('swim_posture',val)
      },
      get(){
        const value = this.getDataValue('swim_posture') || ''
        return value.split(',')
      },
      comment: '会哪些游泳方式'
    },
    max_distance: {
      type: Sequelize.MEDIUMINT,
      defaultValue: 0,
      comment: '最大游泳距离'
    },
    user_id: {
      type: Sequelize.INTEGER,
      comment: '用户id'
    },
    is_delete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '是否删除'
    }
},{
  sequelize,
  modelName:'user_refer',
  timestamps: true,
  engine:'Innodb'
})

// 创建
Refer.sync({ force: force })

module.exports = {Refer, Sequelize, sequelize}