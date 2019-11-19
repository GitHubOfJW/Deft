const fs =  require('fs')
const path  =  require('path')
module.exports = class MetaService {
  // 获取平台列表
  static async getPlatform() {
    // 路径
    const filePath = path.join(__dirname,'../jsons/platform.json')
    const buffer = fs.readFileSync(filePath)
    const dataStr = buffer.toString()
    return JSON.parse(dataStr)
  }  
}