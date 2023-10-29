const getPool = require('../connectionDB.js');

/**
 * 新增顧客訂單，如果已經有了就會變修改數量。
 * @param {*} customerID 
 * @param {*} quantity 
 * @param {*} food 
 * @param {*} restaurantName
 */

module.exports = async function (customerID, quantity, food, restaurantName) {

    return new Promise((resolve, reject) => {
        const pool = getPool();
        for (let num = 0; num < quantity.length; num++) {
            let sql =
            `
            UPDATE \`CART\` 
            SET Amount = ${quantity[num]} 
            WHERE Food = "${food[num]}"
            AND CustomerID = "${customerID}" 
            AND RestaurantName = "${restaurantName}"
            AND Confirmed = False
            `;
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
    })
}