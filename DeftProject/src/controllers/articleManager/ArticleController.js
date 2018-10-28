// 引入baseController
const BaseController = require('../BaseController');

const articleModel =  require('../../models/articleManager/Article')

const cateModel =  require('../../models/cateManager/ArticleCate')

const UploadUtil = require('../../utils/UploadUtil')

const path = require('path')

const StringUtil = require('../../utils/StringUtil')

const fse = require('fs-extra')

class ArticleController extends BaseController {
  
  //管理员列表页面
  static articleListPage(req,res){
     
    super.setHtmlHeader(res);
   
    res.render('article/article-list.html',{
      account:req.session.user
    });
  }

  //管理管理员列表请求
  static async articleList(req,res){
    const start = req.query.start || '';
    const end = req.query.end || '';
    const username = req.query.username || '';
    const contact = req.query.contact || '';
    const page = req.query.page || 1;
    const pageSize = parseInt(req.query.pageSize || 10);
    
    const conditions = {
      page:page,
      start:start,
      end:end,
      username:username,
      contact:contact
    };

    const count = await articleModel.totalCount(conditions);

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
    
    const list = await articleModel.list(page,pageSize,conditions)
 
    const data =  {
      data:list,
      count:count,
      totalPage:totalPage
    }
    const result = super.handlerListResponseData(list.length > 0 ? 0:1,data,list.length <= 0 ? '暂未获取到任何数据':'成功');
    res.json(result);
  }

  // 状态更新
  static async articleUpdate(req,res){
    if(req.params.id){
      const data = await articleModel.update(req.body,req.params.id);
      if(data){
        if(req.session.user && req.session.user.id == req.params.id){
          const model = await articleModel.findOne(req.params.id)
          if(model){
            // 设置model到sesson中
            req.session.user = model;
          }
        }
        const result = super.handlerResponseData(1,'修改成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(0,'修改失败');
        res.json(result);
      }
      
    }else{
      const result = super.handlerResponseData(0,'修改失败，缺少唯一标识');
      res.json(result);
    }
  }

  // 添加管理员页
  static articleAddPage(req,res){
    super.setHtmlHeader(res);

    const cateList = cateModel.list(-1,-1,false)

    res.render('article/article-add.html',{
      cateList:cateList
    });
  }

  // 添加权限请求
  static async articleAdd(req,res){
    if(super.validator(req.body.title,{required:true},'标题',res)
    ||super.validator(req.body.cate_id,{required:true,isInt:true},'分类',res)
    ||super.validator(req.body.content,{required:true},'内容',res)
    ) return;
    
    if(req.body.imgs){
        const  articlePath =  UploadUtil.articleDirPath();
        for(let imgUrl of req.body.imgs.split(',')){
          const source = path.join(articlePath,imgUrl);
          const dest =  path.join(articlePath,imgUrl.replace('_[y]','_[n]'))
          fse.rename(source,dest);
        }
    }
    delete req.body.imgs
    
    const data =  articleModel.insert({
      ...req.body,
      admin_id:req.session.user.id
    })

    if(data){
      const result = super.handlerResponseData(1,'添加成功');
      res.json(result);
    }else{
      const result = super.handlerResponseData(0,'添加失败');
      res.json(result);
    }
     
  }


  // 删除
  static async articleDelete(req,res){
    if(req.body.ids){
      const data = await articleModel.deleteByIds(req.body.ids.split(','))
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
  static async articleRemove(req,res){
    if(req.body.ids){
      const data = await articleModel.removeByIds(req.body.ids.split(','))
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

  // 管理员编辑
  static async articleEditPage(req,res){
    super.setHtmlHeader(res);
    if(!req.params.id){
      const result = super.handlerResponseData(0,'未获取到对应的id');
      res.json(result);
      return;
    }

    const cateList = cateModel.list(-1,-1,false)
    const article = await articleModel.findOne(req.params.id)
    article.content = escape(article.content)
    res.render('article/article-edit.html',{
      article:article,
      cateList:cateList,
    });

  }

  // 编辑
  static async articleEdit(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(0,'未获取到对应的id');
      res.json(result);
      return;
    }

    if(super.validator(req.body.title,{required:true},'标题',res)
    ||super.validator(req.body.cate_id,{required:true,isInt:true},'分类',res)
    ||super.validator(req.body.content,{required:true},'内容',res)
    ) return;
    
    if(req.body.imgs){
        const  articlePath =  UploadUtil.articleDirPath();
        for(let imgUrl of req.body.imgs.split(',')){
          const source = path.join(articlePath,imgUrl);
          const dest =  path.join(articlePath,imgUrl.replace('_[y]','_[n]'))
          fse.rename(source,dest);
        }
    }
    delete req.body.imgs

    const data = await articleModel.update(req.body,req.params.id)
    if(data){
      if(req.session.user && req.session.user.id == req.params.id){
        const model = await articleModel.findOne(req.params.id)
        if(model){
          // 设置model到sesson中
          req.session.user = model;
        }
      }
      const result = super.handlerResponseData(1,'修改成功');
      res.json(result);
    }else{
      const result = super.handlerResponseData(0,'修改失败');
      res.json(result);
    }
  }
}

module.exports = ArticleController