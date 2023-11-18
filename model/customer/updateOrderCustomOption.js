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

module.exports = async function (custom, option, food, customerID, restaurantName) {

    let sql =
    `
    UPDATE CART_CUSTOMIZE
    SET \`Option\` = ?
    WHERE Custom = ? 
    AND Food = ?
    AND CustomerID = ?
    AND RestaurantName = ?
    `;
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        await connectionTool.query(connection, sql, [option, custom, food, customerID, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    } 
}