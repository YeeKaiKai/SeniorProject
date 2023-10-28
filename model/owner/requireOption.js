const getPool = require('../connectionDB.js');

/**
 *
 * @param {String} custom 
 * @param {Object[]} option 
 * @param {Object[]} price
 * @param {String} restaurantName
 */
module.exports = async function (custom, restaurantName) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT *
        FROM CUSTOM_OPTION
        WHERE Custom = "${custom}"
        AND RestaurantName = "${restaurantName}";
        `;
        const pool = getPool(restaurantName);
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