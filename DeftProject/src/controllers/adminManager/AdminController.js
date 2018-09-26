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
    const end = req.body.end;
    const username = req.body.username;
    const page = req.body.nextpage | 1;
    const prePage =  req.body.page | 1;
    const pageSize = req.body.pageSize | 8;
    
    const count = await adminModel.totalCount();

    console.log(page);

    // 计算页数
    const totalPage = (count +  pageSize - 1) / pageSize;

    // 遍历
    let pagination =  [];

    let startPage = page - 2 > 0 ? page - 2 : 1;
    let endPage =  startPage + 4 > totalPage ? totalPage : startPage + 4;
    
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
      pagination:{
        start:startPage,
        end:endPage
      },
      conditions:conditions
    }
    const result = super.handlerResponseData(1,data,'获取成功')
    res.json(result);
  }
}

module.exports =  new AdminController();