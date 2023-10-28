const getPool = require('../connectionDB.js');

module.exports = async function (customerID, restaurantID, restaurantName) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        DELETE FROM \`ORDER\`
        WHERE CustomerID = "${customerID}" AND RestaurantID = "${restaurantID}";
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