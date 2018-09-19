const { sequelize, Sequelize } = require('../../utils/Squelize')
const baseTrigramsModel = require('../../models/trigrams/BaseTrigrams')
class Trigrams {

  //配置映射
   constructor(){
      this.instance = sequelize.define('tbl_trigrams', {
        name: { 
          type: Sequelize.STRING(10),
          allowNull: false,
          comment: '卦象名称'
        },
        top: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: '上卦编号'
        },
        bottom: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: '下卦象编号'
        },
        num: {
          type:Sequelize.STRING(3),
          allowNull: false,
          defaultValue: 0,
          comment: '卦象编号'
        }
      },{
        engine: 'MYISAM',
        createdAt: false,
        updatedAt: false
      })

      this.instance.belongsTo(baseTrigramsModel.instance,{ foreignKey: 'top', as: 'topTrigram', foreignKeyConstraint: false})
      this.instance.belongsTo(baseTrigramsModel.instance,{ foreignKey: 'bottom', as: 'bottomTrigram', foreignKeyConstraint: false})
     
      this.instance.sync({ force: false })
   }

   // 获取数据
   list(){
    const Trigrams =  this.instance;
    let data = this.instance.findAll({
      include: [{
        model: baseTrigramsModel,
        where: {id:Sequelize.col('this.instance.top')}
      },{
        model: baseTrigramsModel,
        where: {id:Sequelize.col('this.instance.bottom')}
      }]
    });
    return data;
   }
   
}


module.exports = new Trigrams();