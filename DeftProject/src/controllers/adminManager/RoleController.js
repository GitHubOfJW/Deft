// 引入baseController
const BaseController = require('../BaseController');

const adminModel =  require('../../models/adminManager/Admin')

const authModel =  require('../../models/adminManager/Auth')
const authCateModel = require('../../models/adminManager/AuthCate')
const roleModel =  require('../../models/adminManager/Role')

const { adminApi, adminPage } = require('../../configure/routerConfig')
 
class RoleController extends BaseController {
   
  // 状态更新
  static async roleUpate(req,res){
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
  static async roleList(req,res){
    const page = req.query.nextpage || 1;
    const prePage =  req.query.page || 1;
    const pageSize = req.query.pageSize || 8;
    const name =  req.query.name || '';
    const start = req.query.start || '';
    const end = req.query.end || '';
    
    const count = await roleModel.totalCount();

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
 
    let pagination = super.pagination(page,totalPage);
      
    const conditions = {
      page:page,
      name:name,
      start:start,
      end:end
    };

    const list = await roleModel.list(page,pageSize,conditions)

    const data =  {
      list:list,
      totalCount:count,
      totalPage:totalPage,
      pagination:pagination,
      conditions:conditions
    }
    const result = super.handlerResponseData(1,'获取成功',data)
    res.json(result);
  }

  // 角色管理
  static roleListPage(req,res){
    super.setHtmlHeader(res);

    // 获取权限
    const cateList = authCateModel.list(-1, -1);
    res.render('admin/admin-role.html',{
      cateList
    });
  }

  // 权限添加
  static async roleAddPage(req,res){
    super.setHtmlHeader(res);
  
    const cateList  = await authCateModel.list(-1,-1,true);
  
    res.render('admin/role-add.html',{
      cateList
    });
  }
 
  // 添加权限请求
  static async roleAdd(req,res){
    if(req.body.name && req.body.authIds){
      const data =  roleModel.insert({
        name:req.body.name,
        authIds:(typeof req.body.authIds == 'number')? [req.body.authIds] : req.body.authIds,
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
  static roleEdit(req,res){
    console.log(req.body,'查看body')
    if(req.body.name && req.body.authIds && req.params.id){
      const data =  roleModel.update({
        name:req.body.name,
        authIds:(typeof req.body.authIds == 'number')? [req.body.authIds] : req.body.authIds,
        remark:req.body.remark
      },req.params.id)
      if(data){
        const result = super.handlerResponseData(1,'修改成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(0,'修改失败');
        res.json(result);
      }
    }else{
      const result = super.handlerResponseData(0,'修改失败，缺少参数');
      res.json(result);
    }
    
  }

  // 编辑页面
  static async roleEditPage(req,res){
    super.setHtmlHeader(res);

    if(!req.params.id){
      const result = super.handlerResponseData(0,'未获取到对应的id');
      res.json(result);
      return;
    }
    
    const cateList  = await authCateModel.list(-1,-1,true);
    const roleCateList = await authCateModel.list(-1,-1,false,req.params.id);
    const cateMap = {};
    for(let cateItem of roleCateList){
      cateMap[cateItem.id] = {
        auths:cateItem.auths,
        ids:cateItem.auths.map(authItem => {
          return authItem.id
        }).join(',')
      }
    }
    const role = await roleModel.findOne(req.params.id)
    res.render('admin/role-edit.html',{
      cateList:cateList,
      role:role,
      roleCates:cateMap
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
  static async roleDelete(req,res){
    if(req.body.ids){
      const data = await roleModel.deleteByIds(req.body.ids.split(','))
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
  static async roleRemove(req,res){
    if(req.body.ids){
      const data = await roleModel.removeByIds(req.body.ids.split(','))
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

module.exports = RoleController