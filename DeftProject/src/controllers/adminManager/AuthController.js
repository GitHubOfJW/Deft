// 引入baseController
const BaseController = require('../BaseController');

const adminModel =  require('../../models/adminManager/Admin')

const authModel =  require('../../models/adminManager/Auth')
const authCateModel = require('../../models/adminManager/AuthCate')

const { adminApi, adminPage } = require('../../configure/routerConfig')
 
class AuthController extends BaseController {
   
  // 状态更新
  async authUpate(req,res){
    if(req.params.id){

      const data = await authModel.update(req.body,req.params.id);
      if(data){
        const result = super.handlerResponseData(1,data,'修改成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(0,data,'修改失败');
        res.json(result);
      }
      
    }else{
      const result = super.handlerResponseData(0,{},'修改失败，缺少唯一标识');
      res.json(result);
    }
  }

  //权限分类列表请求
  async authList(req,res){
    const page = req.query.nextpage || 1;
    const prePage =  req.query.page || 1;
    const pageSize = req.query.pageSize || 8;
    
    const count = await authModel.totalCount();

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
 
    let pagination = super.pagination(page,totalPage);
      
    const conditions = {
      page:page
    };

    const list = await authModel.list(page,pageSize,conditions)

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

  // 规则管理
  authListPage(req,res){
    super.setHtmlHeader(res);
    res.render('admin/admin-rule.html');
  }

  // 权限添加
  async authAddPage(req,res){
    super.setHtmlHeader(res);
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

    const cateList  = await authCateModel.list(-1,-1);

    res.render('admin/auth-add.html',{
      authList,
      cateList
    });
  }
 
  // 添加权限请求
  async authAdd(req,res){
    if(req.body.name && req.body.rules && req.body.rules.length && req.body.cateId){
      const data =  authModel.insert({
        name:req.body.name,
        rules:req.body.rules.join(','),
        authCateId:req.body.cateId,
        remark:req.body.remark
      })
      if(data){
        const result = super.handlerResponseData(1,{},'添加成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(0,{},'添加失败');
        res.json(result);
      }
    }else{
      const result = super.handlerResponseData(0,{},'添加失败，缺少参数');
      res.json(result);
    }
     
  }
}

module.exports =  new AuthController();