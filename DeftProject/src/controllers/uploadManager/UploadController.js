// 引入baseController
const BaseController = require('../BaseController');

const productCateModel =  require('../../models/cateManager/ProductCate')

const multiparty = require('multiparty')

const path = require('path')
const fs =  require('fs-extra')
const UploadUtil = require('../../utils/UploadUtil')
  
class UploadController extends BaseController {
  
    static async imageUpload(req,res){
     /* 生成multiparty对象，并配置上传目标路径 */
     var form = new multiparty.Form();
     /* 设置编辑 */
     form.encoding = 'utf-8';
     //设置文件存储路劲
     const uploadDir = UploadUtil.articleDirPath();
     form.uploadDir = uploadDir;
     //设置文件大小限制
     form.maxFilesSize = 2 * 1024 * 1024;
     // form.maxFields = 1000;   //设置所有文件的大小总和
     //上传后处理
     form.parse(req, (err, fields, files) => {
        //  const filesTemp = JSON.stringify(files, null, 2);
         console.log(files,err)
         if(err) {
            const result =  super.handlerResponseData(0,'上传失败');
            res.json(result)
         }else {
            //  console.log('parse files:' + filesTemp);
            //  console.log('parse files:' + files);
             var imgs = files.imgs[0];
             var uploadedPath = imgs.path;
             
             //重命名为真实文件名
             const name = path.basename(uploadedPath,path.extname(uploadedPath)) + '_[0]';
             const fileName =  name+path.extname(uploadedPath)
             const dstPath = path.join(UploadUtil.articleDirPath(),fileName);
             fs.renameSync(uploadedPath,dstPath);

            const result =  super.handlerResponseData(1,'上传成功',{
              imageName:fileName,
              url:path.join(UploadUtil.articleDirPath(true),fileName)
            });
            res.json(result)
         }
        
     })
  }
 
}

module.exports =  UploadController