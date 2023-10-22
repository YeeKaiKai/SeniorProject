const getPool = require('../connectionDB.js');

/**
 *
 * @param {String} restaurantName
 * @param {String} restaurantID
 */
module.exports = async function (restaurantName, restaurantID) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT *
        FROM FOOD_CUSTOM
        WHERE restaurantID = "${restaurantID}";
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