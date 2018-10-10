// 引入baseController
const BaseController = require('../BaseController');

const adminModel =  require('../../models/adminManager/Admin')

const authCateModel =  require('../../models/adminManager/AuthCate')

const { adminApi, adminPage } = require('../../configure/routerConfig')
 
class CateController extends BaseController {
  
   // 状态更新
  static async cateUpdate(req,res){
    if(req.params.id){

      const data = await authCateModel.update(req.body,req.params.id);
      if(data){
        const result = super.handlerResponseData(1,data,'修改成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(1,data,'修改失败');
        res.json(result);
      }
      
    }else{
      const result = super.handlerResponseData(0,{},'修改失败，缺少唯一标识');
      res.json(result);
    }
  }

  // 分类
  static cateListPage(req,res){
    super.setHtmlHeader(res)
    res.render('admin/admin-cate.html');
  }

   //权限分类列表请求
  static async cateList(req,res){
    const page = req.query.nextpage || 1;
    const prePage =  req.query.page || 1;
    const pageSize = req.query.pageSize || 8;
    
    const count = await authCateModel.totalCount();

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
 
    let pagination = super.pagination(page,totalPage);
      
    const conditions = {
      page:page
    };

    const list = await authCateModel.list(page,pageSize)

    const data =  {
      list:list,
      totalCount:count,
      totalPage:totalPage,
      pagination:pagination,
      conditions:conditions
    }
    const result = super.handlerResponseData(1,data,'获取成功')
    res.json(result);
  }

  // 添加权限分类
  static async cateAdd(req,res){
    if(req.body.name){
      const result = await authCateModel.insert({
        name: req.body.name
      })

      if(result){
        const result = super.handlerResponseData(1,{},'添加成功！');
        res.json(result); 
      }else{
        const result = super.handlerResponseData(0,{},'缺少分类名称');
        res.json(result);
      }
    }else{
      const result = super.handlerResponseData(0,{},'缺少分类名称');
      res.json(result);
    }
  }


  // 删除
  static async cateDelete(req,res){
    if(req.body.ids){
      const data = await cateModel.deleteByIds(req.body.ids.split(','))
      if(data){
        const result = super.handlerResponseData(1,data,'删除成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(0,data,'删除失败');
        res.json(result);
      }
      
    }else{
      const result = super.handlerResponseData(0,{},'删除失败，缺少参数');
      res.json(result);
    }
  }

  // 彻底删除
  static async cateRemove(req,res){
    if(req.body.ids){
      const data = await cateModel.removeByIds(req.body.ids.split(','))
      if(data){
        const result = super.handlerResponseData(1,data,'删除成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(0,data,'删除失败');
        res.json(result);
      }
      
    }else{
      const result = super.handlerResponseData(0,{},'删除失败，缺少参数');
      res.json(result);
    }
  }
}

module.exports =  CateController