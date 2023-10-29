const getPool = require('../connectionDB.js');

/**
 *
 * @param {String} restaurantName
 */
module.exports = async function (restaurantName) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT *
        FROM FOOD_CUSTOM
        WHERE RestaurantName = "${restaurantName}";
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