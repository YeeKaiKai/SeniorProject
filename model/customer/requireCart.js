const getPool = require("../connectionDB.js");

module.exports = async function (restaurantName, customerID) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT * 
        FROM CART AS C
        RIGHT JOIN CART_CUSTOMIZE AS CC
        ON C.CustomerID = CC.CustomerID
            AND C.Food = CC.Food
            AND C.CustomID = CC.CustomID
            AND C.RestaurantName = CC.RestaurantName
        WHERE Confirmed = FALSE AND RestaurantName = ? AND CustomerID = ?
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