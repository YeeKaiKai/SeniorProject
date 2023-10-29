const getPool = require('../connectionDB.js');

/**
 * 新增顧客訂單，如果已經有了就會變修改數量。
 * @param {*} customerID 
 * @param {*} quantity 
 * @param {*} food 
 * @param {*} note
 * @param {*} restaurantName
 */

module.exports = async function (customerID, quantity, food, note, restaurantName) {

    return new Promise((resolve, reject) => {
        const pool = getPool();
        let sql =
        `
        INSERT INTO \`CART\`(CustomerID, CustomID, Food, Amount, Note, RestaurantName)
        SELECT "${customerID}", (SELECT IFNULL(MAX(CustomID), 0) + 1 FROM CART WHERE CustomerID = "${customerID}" AND Food = "${food}" AND RestaurantName = "${restaurantName}"), "${food}", ${quantity}, "${note}", "${restaurantName}"
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