const getPool = require('../connectionDB.js');

/**
 * Owner Create a new food custom
 * @param {String} custom 
 * @param {*} minOption
 * @param {*} maxOption
 * @param {String} restaurantName
 */
module.exports = async function (custom, option, optionPrice, restaurantName) {

    return new Promise((resolve, reject) => {
        const pool = getPool();
        let result;
    
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                throw conn_err;
            }
            for (let num = 0; num < option.length; num++) {
                let sql = 
                `
                INSERT INTO CUSTOM_OPTION(Custom, \`Option\`, OptionPrice, RestaurantName)
                VALUES("${custom}", "${option[num]}", "${optionPrice[num]}", "${restaurantName}");
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