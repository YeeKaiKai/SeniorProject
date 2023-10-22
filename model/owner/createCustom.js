const getPool = require('../connectionDB.js');

/**
 * Owner Create a new food custom
 * @param {String} custom 
 * @param {Integer} minOption
 * @param {Integer} maxOption
 * @param {String} restaurantName
 * @param {String} restaurantID
 */
module.exports = async function (custom, minOption, maxOption, restaurantName, restaurantID) {

    return new Promise((resolve, reject) => {
        const pool = getPool(restaurantName);
    
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                throw conn_err;
            }
            let sql = 
            `
            INSERT INTO FOOD_CUSTOM(Custom, RestaurantID, MinOption, MaxOption)
            VALUES("${custom}", "${restaurantID}", "${minOption}", "${maxOption}");
            `;
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