const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (customerID, customerText, gptText, restaurantName) {

    let sql = 
    `
    INSERT INTO DIALOGUE(CustomerID, Content)
    VALUES(?, ?)
    `;
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        gptText = "服務生：" + gptText;
        await connectionTool.beginTransaction(connection);
        await connectionTool.query(connection, sql, [customerID, customerText]);
        await connectionTool.query(connection, sql, [customerID, gptText]);
        await connectionTool.commit(connection);
        connection.release();
    } catch(error) {
        await connectionTool.rollback();
        connection.release();
        throw error;
    }
}