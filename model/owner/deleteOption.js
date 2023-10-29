const getPool = require('../connectionDB.js');

module.exports = async function (custom, option, restaurantName) {

    return new Promise((resolve, reject) => {
        let result;
        const pool = getPool();
        
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                throw conn_err;
            }
            let sql = 
            `
            DELETE FROM CUSTOM_OPTION
            WHERE Custom = "${custom}" 
            AND \`Option\` = "${option}"
            AND RestaurantName = "${restaurantName}";
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