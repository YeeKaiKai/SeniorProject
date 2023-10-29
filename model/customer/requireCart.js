const getPool = require("../connectionDB.js");

module.exports = async function (restaurantName, customerID) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT Food, Amount, Note 
        FROM \`CART\`
        WHERE Confirmed = FALSE AND RestaurantName = "${restaurantName}" AND CustomerID = "${customerID}"
        `;
        const pool = getPool();
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                reject(conn_err);
            } 
            connection.query(sql, (query_err, results) => {
                if (query_err) {
                    reject(query_err);
                } 
                resolve(results);
            })
            if (connection) {
                connection.release();
            }
        })
    })

} 