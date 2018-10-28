const path =  require('path')
const fse =  require('fs-extra')

module.exports =  class UploadUtil {
  static articleDirPath(server = false){
   if(server){
     return '/public/resource/article/'
   }
   const filePath = path.join(path.dirname(__filename),'../../public/resource/article/')
   UploadUtil.syncDirPath(filePath)
   return filePath;
  }
  
  static  syncDirPath(path){ 
      // 如果不存在路径
      if(!fse.pathExistsSync(path)){
         if(fse.mkdirpSync(path)){
           return true;
         }else{
           return false
         }
      }
      return true
  }
}