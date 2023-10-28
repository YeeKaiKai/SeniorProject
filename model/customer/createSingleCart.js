const getPool = require('../connectionDB.js');

/**
 * 新增顧客訂單，如果已經有了就會變修改數量。
 * @param {*} customerID 
 * @param {*} quantity 
 * @param {*} food 
 * @param {*} note
 * @param {*} restaurantID 
 * @param {*} restaurantName
 */

module.exports = async function (customerID, quantity, food, note, restaurantID, restaurantName) {

    return new Promise((resolve, reject) => {
        const pool = getPool(restaurantName);
        let sql =
        `
        INSERT INTO \`CART\`(CustomerID, Food, Amount, Note, RestaurantID)
        VALUES ("${customerID}", "${food}", ${quantity}, "${note}", "${restaurantID}")
        ON DUPLICATE KEY
        UPDATE Amount = ${quantity}
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
    })
}