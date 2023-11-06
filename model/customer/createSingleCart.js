const getPool = require('../connectionDB.js');
const connectionTool = require('../connectionTool.js');

/**
 * 新增顧客訂單，如果已經有了就會變修改數量。
 * @param {*} customerID 
 * @param {*} quantity 
 * @param {*} food 
 * @param {*} note
 * @param {*} restaurantName
 */

module.exports = async function (customerID, quantity, food, note, restaurantName) {

    const pool = getPool();
    let sql =
    `
    INSERT INTO \`CART\`(CustomerID, CustomID, Food, Amount, Note, RestaurantName)
    SELECT ?, (SELECT IFNULL(MAX(CustomID), 0) + 1 FROM CART WHERE CustomerID = ? AND Food = ? AND RestaurantName = ?), ?, ?, ?, ?
    ON DUPLICATE KEY
    UPDATE Amount = ?
    `;
    const connection = await connectionTool.getConnection(pool);
    await connectionTool.query(connection, sql, [customerID, customerID, food, restaurantName, food, quantity, note, restaurantName, quantity]);
    connectionTool.release(connection);
       
}