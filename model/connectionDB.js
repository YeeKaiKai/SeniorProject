const mysql = require("mysql");
const config = require("../config/config.js");

/**
 * Create a Connection
 */

// 每間餐廳各自的連接池
const poolCache = {}; 

function getPool(databaseName) {
  if (!poolCache[databaseName]) {
    poolCache[databaseName] = mysql.createPool({
      connectionLimit: 20,
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.USER,
      password: config.PASSWORD,
      database: databaseName,
      multipleStatements: true,
      timezone: "UTC"
    });
  }
  return poolCache[databaseName];
}

// const pool = mysql.createPool(
//   {
//     connectionLimit: 20,
//     host: config.HOST,
//     port: config.PORT,
//     user: config.USER,
//     password: config.PASSWORD,
//     database: config.DATABASE,
//     multipleStatements: true,
//     timezone: "UTC"
//   }
// );

module.exports = getPool;