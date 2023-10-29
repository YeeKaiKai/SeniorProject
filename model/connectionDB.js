const mysql = require("mysql");
const config = require("../config/config.js");

/**
 * Create a Connection
 */

function getPool() {
  let pool = mysql.createPool({
      connectionLimit: 20,
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.USER,
      password: config.PASSWORD,
      database: config.DATABASE,
      multipleStatements: true,
      timezone: "UTC"
  });
  return pool;
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