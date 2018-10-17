// 引入baseController
const BaseController = require('../BaseController');

const adminModel =  require('../../models/adminManager/Admin')

const authCateModel =  require('../../models/adminManager/AuthCate')

const { adminApi, adminPage } = require('../../configure/routerConfig')

const roleModel =  require('../../models/adminManager/Role')

 
class AdminController extends BaseController {
  
  //管理员列表页面
  static adminListPage(req,res){
     
    super.setHtmlHeader(res);
   
    res.render('admin/admin-list.html');
  }

  //管理管理员列表请求
  static async adminList(req,res){
    const start = req.query.start || '';
    const end = req.query.end || '';
    const username = req.query.username || '';
    const contact = req.query.contact || '';
    const page = req.query.nextpage || 1;
    const prePage =  req.query.page || 1;
    const pageSize = req.query.pageSize || 8;
    
    const count = await adminModel.totalCount();

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
 
    let pagination = super.pagination(page,totalPage);
      
    const conditions = {
      page:page,
      start:start,
      end:end,
      username:username,
      contact:contact
    };
    
    const list = await adminModel.list(page,pageSize,conditions)

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

  // 状态更新
  static async adminUpdate(req,res){
    if(req.params.id){
      const data = await adminModel.update(req.body,req.params.id);
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

  // 添加管理员页
  static adminAddPage(req,res){
    super.setHtmlHeader(res);

    const roles = roleModel.list(-1,-1,false)

    res.render('admin/admin-add.html',{
      roles:roles
    });
  }

  // 添加权限请求
  static async adminAdd(req,res){
    if(super.validator(req.body.account,{required:true},'用户名',res)
    ||super.validator(req.body.mobile,{required:true,isMobile:true},'手机号',res)
    ||super.validator(req.body.email,{required:true,isEmail:true},'邮箱',res)
    ||super.validator(req.body.name,{required:true,min:2,max:6},'姓名',res)
    ||super.validator(req.body.password,{required:true,regular:{enable:true,regx:/[a-z0-9A-Z]{6,12}/,prompt:"密码必须为6-12大小写字母、数字组合"}},'密码',res)
    ||super.validator(req.body.roleId,{required:true,isInt:true},'角色',res)
    ||super.validator(req.body.enable,{required:true,isBoolean:true},'启用状态',res)
    ) return;

    let count = await adminModel.has({
        account:req.body.account
    })
    if(count>0){
      const result = super.handlerResponseData(0,'用户名已存在');
      res.json(result);
      return;     
    }

    count = await adminModel.has({
      mobile:req.body.mobile
    })
    if(count>0){
      const result = super.handlerResponseData(0,'手机号已存在');
      res.json(result);
      return;     
    }

    count = await adminModel.has({
      email:req.body.email
    })
    if(count>0){
      const result = super.handlerResponseData(0,'邮箱已存在');
      res.json(result);
      return;     
    }

 
    const data =  adminModel.insert(req.body)
    if(data){
      const result = super.handlerResponseData(1,'添加成功');
      res.json(result);
    }else{
      const result = super.handlerResponseData(0,'添加失败');
      res.json(result);
    }
     
  }


  // 删除
  static async adminDelete(req,res){
    if(req.body.ids){
      const data = await adminModel.deleteByIds(req.body.ids.split(','))
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
  static async adminRemove(req,res){
    if(req.body.ids){
      const data = await adminModel.removeByIds(req.body.ids.split(','))
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
  static async adminEditPage(req,res){
    super.setHtmlHeader(res);
    if(!req.params.id){
      const result = super.handlerResponseData(0,'未获取到对应的id');
      res.json(result);
      return;
    }

    const roles = roleModel.list(-1,-1,false)
    const admin = await adminModel.findOne(req.params.id)
    res.render('admin/admin-edit.html',{
      admin:admin,
      roles:roles,
      account:req.session.user
    });

  }

  // 编辑
  static async adminEdit(req,res){
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

    let count = await adminModel.has({
        account:req.body.account,
    },req.params.id)
    if(count>0){
      const result = super.handlerResponseData(0,'用户名已存在');
      res.json(result);
      return;     
    }

    count = await adminModel.has({
      mobile:req.body.mobile
    },req.params.id)
    if(count>0){
      const result = super.handlerResponseData(0,'手机号已存在');
      res.json(result);
      return;     
    }

    count = await adminModel.has({
      email:req.body.email
    },req.params.id)
    if(count>0){
      const result = super.handlerResponseData(0,'邮箱已存在');
      res.json(result);
      return;     
    }

 
    const data =  adminModel.update(req.body,req.params.id)
    if(data){
      const result = super.handlerResponseData(1,'修改成功');
      res.json(result);
    }else{
      const result = super.handlerResponseData(0,'修改失败');
      res.json(result);
    }
  }
}

module.exports = AdminController