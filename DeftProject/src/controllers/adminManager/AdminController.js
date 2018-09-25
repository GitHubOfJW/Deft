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
    const page = req.body.page | 1;
    const pageSize = req.body.pageSize | 1;
    
    const count = await adminModel.totalCount();

    // 计算页数
    const totalPage = (count +  pageSize - 1) / pageSize;

    // 遍历
    let pagination =  [];
    const start = page - 2 > 0 ? page - 2 : 1;
    const end = page + 2 > totalPage ? totalPage : page + 2;
    for(let i = start; i <= end;i++){
      pagination.push({
        page:i
      })
    }
    
    const list = await adminModel.list(page,pageSize)

    const data =  {
      list:list,
      totalCount:count,
      pagination:pagination,
      conditions:{
        page:page
      }
    }
    const result = super.handlerResponseData(1,data,'获取成功')
    res.json(result);
  }
}

module.exports =  new AdminController();