const getPool = require('../connectionDB.js');

/**
 * 新增顧客訂單，如果已經有了就會變修改數量。
 * @param {*} customerID 
 * @param {*} quantity 
 * @param {*} food 
 * @param {*} note
 * @param {*} restaurantName
 */

module.exports = async function (custom, option, food, customerID, restaurantName) {

    return new Promise((resolve, reject) => {
        let sql =
        `
        UPDATE CART_CUSTOMIZE
        SET \`Option\` = "${option}"
        WHERE Custom = "${custom}" 
        AND Food = "${food}"
        AND CustomerID = "${customerID}"
        AND RestaurantName = "${restaurantName}"
        `;
        const pool = getPool();
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
    })
}