const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

/**
 * 新增購物車，如果已經有了就會變修改數量。
 * 
 * @param {Number} customerID 
 * @param {Number} quantity 
 * @param {String} food 
 * @param {String} note
 * @param {String} restaurantName
 */

module.exports = async function (customerID, quantity, food, note, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let sql =
    `
    INSERT INTO \`CART\`(CustomerID, CustomID, Food, Amount, Note, RestaurantName)
    SELECT ?, (SELECT IFNULL(MAX(CustomID), 0) + 1 FROM CART WHERE CustomerID = ? AND Food = ? AND RestaurantName = ?), ?, ?, ?, ?
    ON DUPLICATE KEY
    UPDATE Amount = ?
    `;
    try {
        await connectionTool.query(connection, sql, [customerID, customerID, food, restaurantName, food, quantity, note, restaurantName, quantity]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}