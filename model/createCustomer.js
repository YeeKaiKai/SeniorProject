const getPool = require('./connectionDB.js');

module.exports = async function (name, forHere, restaurantID, restaurantName) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        INSERT INTO CUSTOMER(Name, ForHere, RestaurantID)
        VALUES("${name}", "${forHere}", "${restaurantID}")
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