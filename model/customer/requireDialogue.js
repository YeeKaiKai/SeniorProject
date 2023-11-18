const getPool = require("../connectionDB.js");
const connectionTool = require('../connectionTool.js');

module.exports = async function (customerID, restaurantName) {

    let sql = 
    `
    SELECT Content
    FROM DIALOGUE
    WHERE customerID = ?
    `;
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        const results = await connectionTool.query(connection, sql, [customerID]);
        let text = "";
        // 只取最近五次的對話紀錄
        if (results.length !== 0) {
            let start = (results.length - 5) >= 0 ? results.length - 5 : 0;
            let end = (results.length - 5) >= 0 ? 5 : results.length;
            for (let i = 0; i < end; i++) {
                text = text + results[start + i].Content + "\n";
            }
        }
        connectionTool.release(connection);
        return text;
    } catch(error) {
        connectionTool.release(connection);
        throw error;
    }
} 