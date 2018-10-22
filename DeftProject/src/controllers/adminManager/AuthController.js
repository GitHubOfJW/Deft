// 引入baseController
const BaseController = require('../BaseController');

const adminModel =  require('../../models/adminManager/Admin')

const authModel =  require('../../models/adminManager/Auth')
const authCateModel = require('../../models/adminManager/AuthCate')

const { adminApi, adminPage } = require('../../configure/routerConfig')
 
class AuthController extends BaseController {
   
  // 状态更新
  static async authUpate(req,res){
    if(req.params.id){

      const data = await authModel.update(req.body,req.params.id);
      if(data){
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

  //权限分类列表请求
  static async authList(req,res){
    const page = req.query.nextpage || 1;
    const prePage =  req.query.page || 1;
    const pageSize = parseInt(req.query.limit || 10);
    const cateName =  req.query.cateName || '';
    const cateId =  req.query.cateId || '';
    const start = req.query.start || '';
    const end = req.query.end || '';
    

    const conditions = {
      page:page,
      cateName:cateName,
      cateId:cateId,
      start:start,
      end:end
    };


    const count = await authModel.totalCount(conditions);

    // 计算页数
    // const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
 
    // const pagination = super.pagination(page,totalPage);
      
    const list = await authModel.list(page,pageSize,conditions)

    // const data =  {
    //   list:list,
    //   totalCount:count,
    //   totalPage:totalPage,
    //   pagination:pagination,
    //   conditions:conditions
    // }
    // const result = super.handlerResponseData(1,'获取成功',data)
    // res.json(result);
    const data =  {
      data:list,
      count:count,
    }
    const result = super.handlerListResponseData(list.length > 0 ? 0:1,data,list.length <= 0 ? '暂未获取到任何数据':'成功');
    res.json(result);
  }

  // 规则管理
  static authListPage(req,res){
    super.setHtmlHeader(res);

    // 获取权限
    const cateList = authCateModel.list(-1, -1);
    res.render('admin/admin-rule.html',{
      cateList
    });
  }

  // 权限添加
  static async authAddPage(req,res){
    super.setHtmlHeader(res);
  
    const cateList  = await authCateModel.list(-1,-1);
   
    const authList = AuthController.configAuthList()

    res.render('admin/auth-add.html',{
      authList,
      cateList
    });
  }
 
  // 添加权限请求
  static async authAdd(req,res){
    if(req.body.name && req.body.rules && req.body.rules.length && req.body.cateId){
      const data = await authModel.insert({
        name:req.body.name,
        rules:(typeof req.body.rules == 'string')? req.body.rules : req.body.rules.join(','),
        authCateId:req.body.cateId,
        remark:req.body.remark
      })
      if(data){
        const result = super.handlerResponseData(1,'添加成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(0,'添加失败');
        res.json(result);
      }
    }else{
      const result = super.handlerResponseData(0,'添加失败，缺少参数');
      res.json(result);
    }
     
  }

  // 修改请求
  static authEdit(req,res){
    req.body.rules = (typeof req.body.rules == 'string')? req.body.rules : req.body.rules.join(','),
    AuthController.authUpate(req,res)
  }

  // 编辑页面
  static async authEditPage(req,res){
    super.setHtmlHeader(res);

    if(!req.params.id){
      const result = super.handlerResponseData(0,'未获取到对应的id');
      res.json(result);
      return;
    }
    
   

    const authList = AuthController.configAuthList()
    const cateList  = await authCateModel.list(-1,-1);
    const auth =  await authModel.findOne(req.params.id)
    res.render('admin/auth-edit.html',{
      authList,
      cateList,
      auth
    });
  }


  static configAuthList(){
    const authMap = {}
    for(let controllerKey of Object.keys(adminPage)){
       if(!authMap[controllerKey]){
        authMap[controllerKey] = {
            api:[],
            page:[]
          }
       }
       for(let routerKey of Object.keys(adminPage[controllerKey])){
         if(!adminPage[controllerKey][routerKey].selected){
          authMap[controllerKey].page.push(adminPage[controllerKey][routerKey]);
         }
       }
    }

    for(let controllerKey of Object.keys(adminApi)){
      if(!authMap[controllerKey]){
        authMap[controllerKey] = {
           api:[],
           page:[]
         }
      }
      for(let routerKey of Object.keys(adminApi[controllerKey])){
        if(!adminApi[controllerKey][routerKey].selected){
          authMap[controllerKey].api.push(adminApi[controllerKey][routerKey]);
        }
      }
    }
    
    const authList = []
    for(let controllerKey of Object.keys(authMap)){
        authList.push({
          key:controllerKey,
          controller:authMap[controllerKey]
        })
    }

    return authList;
  }

  // 删除
  static async authDelete(req,res){
    if(req.body.ids){
      const data = await authModel.deleteByIds(req.body.ids.split(','))
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
  static async authRemove(req,res){
    if(req.body.ids){
      const data = await authModel.removeByIds(req.body.ids.split(','))
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

module.exports = AuthController