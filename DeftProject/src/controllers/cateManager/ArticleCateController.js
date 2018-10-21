// 引入baseController
const BaseController = require('../BaseController');

const articleCateModel =  require('../../models/cateManager/ArticleCate')

const { adminApi, adminPage } = require('../../configure/routerConfig')
 
class ArticleController extends BaseController {
  
   // 状态更新
  static async cateUpdate(req,res){
    if(req.params.id){

      const data = await articleCateModel.update(req.body,req.params.id);
      if(data){
        const result = super.handlerResponseData(1,'修改成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(1,'修改失败');
        res.json(result);
      }
      
    }else{
      const result = super.handlerResponseData(0,'修改失败，缺少唯一标识');
      res.json(result);
    }
  }

  // 分类
  static cateListPage(req,res){
    super.setHtmlHeader(res)
    res.render('cate/articleCate.html');
  }

   //权限分类列表请求
  static async cateList(req,res){
    const page = req.query.page || 1;
    const pageSize = parseInt(req.query.limit || 10);
    
    const count = await articleCateModel.totalCount();

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
 
    let pagination = super.pagination(page,totalPage);
      
    const conditions = {
      page:page
    };

    const list = await articleCateModel.list(page,pageSize)

    const lists = [];
    for(let item of list){
      item.level = 0;
      lists.push(item)
      if(item.children){
        for(let child of item.children){
          child.level = 1;
          lists.push(child)
        }
      }
    }

    const data =  {
      data:lists,
      count:count,
    }
    const result = super.handlerListResponseData(list.length > 0 ? 0:1,data,list.length < 0 ? '暂未获取到任何数据':'成功');
    res.json(result);
  }

  // 添加分类
  static async cateAdd(req,res){
    if(req.body.name){
      const result = await articleCateModel.insert({
        name: req.body.name
      })

      if(result){
        const result = super.handlerResponseData(1,'添加成功！');
        res.json(result); 
      }else{
        const result = super.handlerResponseData(0,'缺少分类名称');
        res.json(result);
      }
    }else{
      const result = super.handlerResponseData(0,'缺少分类名称');
      res.json(result);
    }
  }


  // 删除
  static async cateDelete(req,res){
    if(req.body.ids){
      const data = await articleCateModel.deleteByIds(req.body.ids.split(','))
      if(data){
        const result = super.handlerResponseData(1,'删除成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(0,'删除失败');
        res.json(result);
      }
      
    }else{
      const result = super.handlerResponseData(0,'删除失败，缺少参数');
      res.json(result);
    }
  }

  // 彻底删除
  static async cateRemove(req,res){
    if(req.body.ids){
      const data = await articleCateModel.removeByIds(req.body.ids.split(','))
      if(data){
        const result = super.handlerResponseData(1,'删除成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(0,'删除失败');
        res.json(result);
      }
      
    }else{
      const result = super.handlerResponseData(0,'删除失败，缺少参数');
      res.json(result);
    }
  }
}

module.exports =  ArticleController