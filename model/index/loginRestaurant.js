const bcrypt = require('bcrypt');

const getPool = require('../connectionDB.js');
const connectionTool = require('../connectionTool.js');

module.exports = async function(email, password) {
    
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        let selectSql = 
        `
        SELECT *
        FROM RESTAURANT
        WHERE Email = ?
        `;
        let results = await connectionTool.query(connection, selectSql, [email]);
        let res;
        if (results.length > 0) {
            res = bcrypt.compareSync(password, results[0].Password);
        }
        connection.release();
        if (res) {
            return results[0].RestaurantName;
        } else {
            return "信箱或密碼錯誤！";
        }
    } catch(error) {
        connection.release();
        throw error;
    }
}