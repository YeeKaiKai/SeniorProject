const getPool = require("../connectionDB.js");
const connectionTool = require('../connectionTool.js');

module.exports = async function () {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let selectSql = 
    `
    SELECT * 
    FROM RESTAURANT
    `;
    try {
        let results = await connectionTool.query(connection, selectSql);
        connection.release();
        return results;
    } catch(error) {
        connection.release();
        throw error;
    }
} 