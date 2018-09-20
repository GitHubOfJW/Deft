// 数据库操作
const Sequelize = require('Sequelize');

// 读取配置文件
const { dbConfig } = require('../configure/config');

const sequelize = new Sequelize(dbConfig.database, dbConfig.username,dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {
  Sequelize:Sequelize,
  sequelize:sequelize
}