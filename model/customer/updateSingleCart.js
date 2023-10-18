const getPool = require('../../connectionDB.js');

/**
 * 新增顧客訂單，如果已經有了就會變修改數量。
 * @param {*} customerID 
 * @param {*} quantity 
 * @param {*} food 
 * @param {*} restaurantID 
 * @param {*} restaurantName
 */

module.exports = async function (customerID, quantity, food, restaurantID, restaurantName) {

    const pool = getPool(restaurantName);
    let sql =
    `
    UPDATE \`ORDER\` 
    SET Amount = ${quantity} 
    WHERE Food = "${food}"
    AND CustomerID = "${customerID}" 
    AND RestaurantID = "${restaurantID}"
    `;
    pool.getConnection((conn_err, connection) => {
        if (conn_err) {
            throw conn_err;
        }
        connection.query(sql, (query_err, results) => {
            if (query_err) {
                throw query_err;
            }
            return results;
        })
        if (connection) {
            connection.release();
        }
    })
}