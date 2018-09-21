// 引入baseController
const BaseController = require('../BaseController');

const adminModel =  require('../../models/adminManager/Admin')
 
class AdminController extends BaseController {
  
  //管理员列表页面
  async adminListPage(req,res){
     
    super.setHtmlHeader(res);
    const page = req.body.page | 1;
    const pageSize = req.body.pageSize | 20;
    
    const count = await adminModel.totalCount();
    // 计算页数
    const totalPage = (count +  pageSize - 1) / pageSize;

    // 遍历
    const pagination =  [];
    const start = page - 2 > 0 ? page - 2 : 1;
    const end = page + 2 > totalPage ? totalPage : page + 2;
    for(let i = start; i <= end;i++){
      pagination.push({
        page:i
      })
    }

    console.log(pagination)
    
    const list = await adminModel.list(page,pageSize)
    res.render('admin/admin-list.html',{
      list:list,
      adminCount:count,
      pagination:pagination,
      conditions:{
        page:page
      }
    });
  }

  //管理管理员列表请求
  adminList(req,res){

  }
}

module.exports =  new AdminController();