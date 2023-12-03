const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

/**
 * 
 * 新增顧客對話
 * 
 * @param {*} customerID 
 * @param {*} customerText 
 * @param {*} gptText 
 * @param {*} restaurantName 
 */
module.exports = async function (customerID, customerText, gptText, restaurantName) {

    let sql = 
    `
    INSERT INTO DIALOGUE(CustomerID, Content, RestaurantName)
    VALUES(?, ?, ?)
    `;
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        gptText = "服務生：" + gptText;
        await connectionTool.beginTransaction(connection);
        await connectionTool.query(connection, sql, [customerID, customerText, restaurantName]);
        await connectionTool.query(connection, sql, [customerID, gptText, restaurantName]);
        await connectionTool.commit(connection);
        connection.release();
    } catch(error) {
        await connectionTool.rollback(connection);
        connection.release();
        throw error;
    }
}