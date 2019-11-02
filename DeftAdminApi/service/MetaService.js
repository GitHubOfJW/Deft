const fs =  require('fs')
const path  =  require('path')
module.exports = class MetaService {
  // 获取肥胖原因
  static async getFat_reasons() {
    // 路径
    const path = path.join(__dirname + '../jsons/fat_reason.json')
    const buffer = fs.readFileSync(path)
    const dataStr = buffer.toString()
    return JSON.parse(dataStr)
  }

  // 获取近两年减肥次数
  static async getReduce_times() {
    // 路径
    const path = path.join(__dirname + '../jsons/reduce_times.json')
    const buffer = fs.readFileSync(path)
    const dataStr = buffer.toString()
    return JSON.parse(dataStr)
  }

  
}