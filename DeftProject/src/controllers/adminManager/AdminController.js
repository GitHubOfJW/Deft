// 引入baseController
const BaseController = require('../BaseController');

const adminModel =  require('../../models/adminManager/Admin')
 
class AdminController extends BaseController {
  
  //管理员列表页面
  adminListPage(req,res){
     
    super.setHtmlHeader(res);
   
    res.render('admin/admin-list.html');
  }

  //管理管理员列表请求
  async adminList(req,res){
    const start = req.body.start;
    const end = req.body.end || '';
    const username = req.body.username || '';
    const page = req.body.nextpage || 1;
    const prePage =  req.body.page || 1;
    const pageSize = req.body.pageSize || 8;
    
    const count = await adminModel.totalCount();

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
 
    let pagination = super.pagination(page,totalPage);
      
    const conditions = {
      page:page,
      start:start,
      end:end,
      username:username
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
        const result = super.handlerResponseData(1,data,'修改失败');
        res.json(result);
      }
      
    }else{
      const result = super.handlerResponseData(0,{},'修改失败，缺少唯一标识');
      res.json(result);
    }
  }
}

module.exports =  new AdminController();