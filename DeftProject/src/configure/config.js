module.exports = {
  dbConfig:{
    database:'deft',
    dialect:'mysql',
    host:'localhost',
    username:'root',
    password:'zhu45683968',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}