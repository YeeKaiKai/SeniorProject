const getPool = require('../../connectionDB.js');

/**
 * Owner Create a new food custom
 * @param {String} custom 
 * @param {Integer} minOption
 * @param {Integer} maxOption
 * @param {String} restaurantName
 */
module.exports = async function (custom, minOption, maxOption, restaurantName) {

    return new Promise((resolve, reject) => {
        const pool = getPool();
    
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                throw conn_err;
            }
            let sql = 
            `
            INSERT INTO FOOD_CUSTOM(Custom, RestaurantName, MinOption, MaxOption)
            VALUES("${custom}", "${restaurantName}", "${minOption}", "${maxOption}");
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