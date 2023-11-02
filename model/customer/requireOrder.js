const getPool = require("../connectionDB.js");

module.exports = async function (restaurantName, customerID) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT * 
        FROM CART AS C
        LEFT JOIN CART_CUSTOMIZE AS CC
        ON C.RestaurantName = CC.RestaurantName AND C.CustomerID = CC.CustomerID
        NATURAL JOIN \`ORDER\`
        WHERE Confirmed = TRUE AND C.RestaurantName = ? AND C.CustomerID = ?
        `;
        const pool = getPool();
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                reject(conn_err);
            } 
            connection.query(sql, [restaurantName, customerID], (query_err, results) => {
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