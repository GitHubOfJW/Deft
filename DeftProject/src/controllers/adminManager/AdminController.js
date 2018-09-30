// 引入baseController
const BaseController = require('../BaseController');

const adminModel =  require('../../models/adminManager/Admin')

const authCateModel =  require('../../models/adminManager/AuthCate')

const { adminApi, adminPage } = require('../../configure/routerConfig')
 
class AdminController extends BaseController {
  
  //管理员列表页面
  adminListPage(req,res){
     
    super.setHtmlHeader(res);
   
    res.render('admin/admin-list.html');
  }

  //管理管理员列表请求
  async adminList(req,res){
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
    const result = super.handlerResponseData(1,data,'获取成功')
    res.json(result);
  }

  // 状态更新
  async adminUpate(req,res){
    if(req.params.id){
      const data = await adminModel.update(req.body,req.params.id);
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

  // 添加管理员页
  adminAddPage(req,res){
    super.setHtmlHeader(res);
    res.render('admin/admin-add.html');
  }
}

module.exports =  new AdminController();