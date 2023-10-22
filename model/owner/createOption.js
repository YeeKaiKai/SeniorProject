const getPool = require('../connectionDB.js');

/**
 * Owner Create a new food custom
 * @param {String} custom 
 * @param {*} minOption
 * @param {*} maxOption
 * @param {String} restaurantName
 * @param {String} restaurantID
 */
module.exports = async function (custom, option, price, restaurantName, restaurantID) {

    return new Promise((resolve, reject) => {
        const pool = getPool(restaurantName);
        let result;
    
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                throw conn_err;
            }
            for (let num = 0; num < option.length; num++) {
                let sql = 
                `
                INSERT INTO CUSTOM_OPTION(Custom, \`Option\`, Price, restaurantID)
                VALUES("${custom}", "${option[num]}", "${price[num]}", "${restaurantID}");
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