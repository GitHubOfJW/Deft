const md5 = require('md5')

module.exports = {
  // 加密
  md5_password : function(origin_pass) {
    return md5(md5(md5(origin_pass)))
  }
}