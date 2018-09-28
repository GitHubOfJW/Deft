module.exports = {
  dbConfig:{
    database:'deft',
    dialect:'mysql',
    host:'localhost',
    username:'root',
    password:'zhu45683968',
    port:3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  sessionDbConfig:{
    database:'deft',
    port:3306,
    user:'root',
    password:'zhu45683968',
    clearExpired:true,
    checkExpirationInterval:3600000,//1小时
    expiration: 86400000,//24小时
  }
}