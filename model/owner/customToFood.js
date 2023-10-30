const getPool = require('../connectionDB.js');

/**
 * Owner Create a new food custom
 * @param {String} custom 
 * @param {Object[]} option 
 * @param {Object[]} price
 */
module.exports = async function (custom, food, restaurantName) {

    return new Promise((resolve, reject) => {
        const pool = getPool(restaurantName);
        let result;
    
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                throw conn_err;
            }
            for (let num = 0; num < custom.length; num++) {
                let sql = 
                `
                INSERT INTO CUSTOMIZE(Custom, Food, RestaurantName)
                VALUES("${custom[num]}", "${food}", "${restaurantName}")
                `;
                connection.query(sql, (query_err, results) => {
                    if (query_err) {
                        throw query_err;
                    }
                    result = results;
                })
            }
            if (connection) {
                connection.release();
            }
        })
        resolve(result);
    })
}