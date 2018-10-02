
// 写一个baseController，用于做一些公共的处理
class BaseController {
  // 用户处理返回的数据
  static handlerResponseData(status = 0,data = {},message = ''){
    return { 
      status: status,
      data: data,
      message: message
    };
  }

  static setHtmlHeader(res){
    res.setHeader("Content-Type", "text/html");
    res.setHeader('charset','utf-8');
  }

  // 处理分页逻辑
  static pagination(jumpPage,totalPage){

    let paginations = [];

    if(totalPage <= 1){
      return paginations;
    }

    let startPage = jumpPage - 2 > 0 ? jumpPage - 2 : 1;
    let endPage =  startPage + 4 > totalPage ? totalPage : startPage + 4;

    if(endPage - 4 >= 1 && endPage - 4 < startPage){
      startPage =  endPage - 4;
    }

    
    for(let i = startPage ; i <= endPage ; i++){
      paginations.push({
        page:i,
        text:i,
        className:'num'
      })
    }

    // 添加<<   >>
    if(startPage > 1){
      let preGroupStart = endPage - 4 > 0 ? endPage - 4 : 1;
      paginations.unshift({
        page:preGroupStart,
        text:"<<",
        className:'pre'
      })
    }
    if(endPage < totalPage){
      let nextGroupEnd =  startPage + 4 > totalPage ? totalPage - 4 : startPage + 4;
      paginations.push({
        page:nextGroupEnd,
        text:">>",
        className:'next'
      })
    }

    return paginations
  }
}

module.exports =  BaseController;