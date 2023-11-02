const getPool = require('../connectionDB.js');

module.exports = async function (restaurantName, orderID) {

    return new Promise((resolve, reject) => {
        let sql =
        `
        UPDATE \`ORDER\`
        SET Paid = TRUE
        WHERE RestaurantName = ?
        AND OrderID = ?
        `;
        const pool = getPool();
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                throw conn_err;
            }
            connection.query(sql, [restaurantName, orderID], (query_err, results) => {
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