
// 写一个baseController，用于做一些公共的处理
class BaseController {
  //用户处理返回的数据
  handlerResponseData(status = 0,data = {},message = ''){
    return { 
      status: status,
      data: data,
      message: message
    };
  }
}

module.exports =  BaseController;