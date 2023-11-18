const getPool = require('../connectionDB.js');
const connectionTool = require('../connectionTool.js');

/**
 * 新增顧客訂單，如果已經有了就會變修改數量。
 * @param {*} customerID 
 * @param {*} quantity 
 * @param {*} food 
 * @param {*} restaurantName
 */

module.exports = async function (customerID, quantity, food, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        await connectionTool.beginTransaction(connection);
        for (let num = 0; num < quantity.length; num++) {
            let sql =
            `
            INSERT INTO \`CART\`(CustomerID, Food, Amount, RestaurantName)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY
            UPDATE Amount = ?
            `;
            await connectionTool.query(connection, sql, [customerID, food[num], quantity[num], restaurantName, quantity[num]]);
        }
        await connectionTool.commit(connection);
        await connectionTool.release(connection);
    } catch(error) {
        await connectionTool.rollback(connection);
        await connectionTool.release(connection);
        throw error;
    }
}