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
            UPDATE \`CART\` 
            SET Amount =? 
            WHERE Food = ?
            AND CustomerID = ? 
            AND RestaurantName = ?
            AND Confirmed = False
            `;
            await connectionTool.query(connection, sql, [quantity[num], food[num], customerID, restaurantName]);
        }
        await connectionTool.commit(connection);
        await connectionTool.release(connection);
    } catch(error) {
        await connectionTool.rollback(connection);
        await connectionTool.release(connection);
        throw error;
    }
}