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
     //上传后处理
     form.parse(req, (err, fields, files) => {
         if(err) {
            const result =  super.handlerResponseData(0,'上传失败');
            res.json(result)
         }else {
             var imgs = files.imgs[0];
             var uploadedPath = imgs.path;
             
             //重命名为真实文件名
             const name = path.basename(uploadedPath,path.extname(uploadedPath)) + '_[y]';
             const fileName =  name+path.extname(uploadedPath)
             const dstPath = path.join(UploadUtil.articleDirPath(),fileName);
             fs.renameSync(uploadedPath,dstPath);

            const result =  super.handlerResponseData(1,'上传成功',{
              imageName:fileName,
              url:req.domainName + path.join(UploadUtil.articleDirPath(true),fileName)
            });
            console.log(req.domainName,'看看当前域名')
            res.json(result)
         }
        
     })
  }
 
}

module.exports =  UploadController