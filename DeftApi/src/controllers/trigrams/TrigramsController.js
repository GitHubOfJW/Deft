
const { sequelize } = require('../../utils/Squelize');
const baseTrigramsModel = require('../../models/trigrams/BaseTrigrams');
const trigramsModel = require('../../models/trigrams/Trigrams')

const BaseController = require('../BaseController')

class TrigramsController extends BaseController {
    
  //获取基础卦象
  async getBaseTrigrams(req, res){
    const data = await  baseTrigramsModel.list()
    const responseData =  super.handlerResponseData(1,data)
    res.end(JSON.stringify(responseData));
  }

  //获取64卦
  async getTrigrams(req, res) {
    const data = await trigramsModel.list();
    const responseData = super.handlerResponseData(1,data);
    res.end(JSON.stringify(data))
  }
}

module.exports = new TrigramsController();