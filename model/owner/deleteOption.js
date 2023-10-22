const getPool = require('../connectionDB.js');

module.exports = async function (custom, option, restaurantID, restaurantName) {

    return new Promise((resolve, reject) => {
        let result;
        const pool = getPool(restaurantName);
        
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                throw conn_err;
            }
            let sql = 
            `
            DELETE FROM CUSTOM_OPTION
            WHERE Custom = "${custom}" 
            AND \`Option\` = "${option}"
            AND RestaurantID = "${restaurantID}";
            `;
            console.log(sql);
            connection.query(sql, (query_err, results) => {
                if (query_err) {
                    throw query_err;
                }
                result = results;
            })
            if (connection) {
                connection.release();
            }
            resolve(result);
        })
    }) 
}