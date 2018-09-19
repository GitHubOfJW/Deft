const { sequelize, Sequelize } = require('../../utils/Squelize')


class BaseTrigrams {

  //配置映射
   constructor(){
      this.instance = sequelize.define('tbl_base_trigrams', {
        nickname: { 
          type: Sequelize.STRING(10),
          allowNull: false,
          comment: '卦象名称'
        },
        name: {
          type: Sequelize.STRING(10),
          allowNull: false,
          comment: '卦象对应名称'
        },
        num: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isNull: true,
            isInt: true
          },
          comment: '卦象编号'
        },
        trigram: {
          type:Sequelize.STRING(3),
          allowNull: false,
          comment: '卦象'
        }
      },{
        engine: 'MYISAM',
        createdAt: false,
        updatedAt: false
      })

      this.instance.sync({ force: false })
   }

   // 获取数据
  list(){
    let data = this.instance.findAll();
    return data;
   }
   
}


module.exports = new BaseTrigrams();