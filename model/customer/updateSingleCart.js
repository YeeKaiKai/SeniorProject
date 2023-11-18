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

    let sql =
    `
    UPDATE \`CART\` 
    SET Amount = ${quantity} 
    WHERE Food = "${food}"
    AND CustomerID = "${customerID}" 
    AND RestaurantName = "${restaurantName}"
    `;
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        await connectionTool.query(connection, sql, [quantity, food, customerID, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
    pool.getConnection((conn_err, connection) => {
        if (conn_err) {
            throw conn_err;
        }
        connection.query(sql, (query_err, results) => {
            if (query_err) {
                throw query_err;
            }
            resolve(results);
        })
        if (connection) {
            connection.release();
        }
    })
}