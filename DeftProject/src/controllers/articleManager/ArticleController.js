// 引入baseController
const BaseController = require('../BaseController');

const articleModel =  require('../../models/articleManager/Article')

const cateModel =  require('../../models/cateManager/ArticleCate')

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
    if(super.validator(req.body.account,{required:true},'用户名',res)
    ||super.validator(req.body.mobile,{required:true,isMobile:true},'手机号',res)
    ||super.validator(req.body.email,{required:true,isEmail:true},'邮箱',res)
    ||super.validator(req.body.name,{required:true,min:2,max:6},'姓名',res)
    ||super.validator(req.body.password,{required:true,regular:{enable:true,regx:/[a-z0-9A-Z]{6,12}/,prompt:"密码必须为6-12大小写字母、数字组合"}},'密码',res)
    ||super.validator(req.body.roleId,{required:true,isInt:true},'角色',res)
    ||super.validator(req.body.enable,{required:true,isBoolean:true},'启用状态',res)
    ) return;

    let count = await articleModel.has({
        account:req.body.account
    })
    if(count>0){
      const result = super.handlerResponseData(0,'用户名已存在');
      res.json(result);
      return;     
    }

    count = await articleModel.has({
      mobile:req.body.mobile
    })
    if(count>0){
      const result = super.handlerResponseData(0,'手机号已存在');
      res.json(result);
      return;     
    }

    count = await articleModel.has({
      email:req.body.email
    })
    if(count>0){
      const result = super.handlerResponseData(0,'邮箱已存在');
      res.json(result);
      return;     
    }

 
    const data =  articleModel.insert(req.body)
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

    const roles = roleModel.list(-1,-1,false)
    const article = await articleModel.findOne(req.params.id)
    res.render('article/article-edit.html',{
      article:article,
      roles:roles,
      account:req.session.user
    });

  }

  // 编辑
  static async articleEdit(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(0,'未获取到对应的id');
      res.json(result);
      return;
    }

    if(super.validator(req.body.account,{required:true},'用户名',res)
    ||super.validator(req.body.mobile,{required:true,isMobile:true},'手机号',res)
    ||super.validator(req.body.email,{required:true,isEmail:true},'邮箱',res)
    ||super.validator(req.body.name,{required:true,min:2,max:6},'姓名',res)
    // ||super.validator(req.body.password,{required:true,regular:{enable:true,regx:/[a-z0-9A-Z]{6,12}/,prompt:"密码必须为6-12大小写字母、数字组合"}},'密码',res)
    ||super.validator(req.body.roleId,{required:true,isInt:true},'角色',res)
    ||super.validator(req.body.enable,{required:true,isBoolean:true},'启用状态',res)
    ) return;

    let count = await articleModel.has({
        account:req.body.account,
    },req.params.id)
    if(count>0){
      const result = super.handlerResponseData(0,'用户名已存在');
      res.json(result);
      return;     
    }

    count = await articleModel.has({
      mobile:req.body.mobile
    },req.params.id)
    if(count>0){
      const result = super.handlerResponseData(0,'手机号已存在');
      res.json(result);
      return;     
    }

    count = await articleModel.has({
      email:req.body.email
    },req.params.id)
    if(count>0){
      const result = super.handlerResponseData(0,'邮箱已存在');
      res.json(result);
      return;     
    }
 
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