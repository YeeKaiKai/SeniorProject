const getPool = require('../connectionDB.js');

module.exports = async function (oldCustom, newCustom, minOption, maxOption, restaurantName) {

    return new Promise((resolve, reject) => {
        let sql =
        `
        UPDATE FOOD_CUSTOM
        SET Custom = "${newCustom}",
        MinOption = "${minOption}",
        MaxOption = "${maxOption}"
        WHERE Custom = "${oldCustom}"
        AND RestaurantName = "${restaurantName}"
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