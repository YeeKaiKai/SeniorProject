const getPool = require('../../connectionDB.js');

module.exports = async function (customerID, restaurantName) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        DELETE FROM \`ORDER\`
        WHERE CustomerID = "${customerID}" AND RestaurantName = "${restaurantName}";
        `;
        const pool = getPool();
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