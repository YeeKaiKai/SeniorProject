const getPool = require("../connectionDB.js");

module.exports = async function (restaurantName, customerID) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT *
        FROM CART c
        LEFT JOIN CART_CUSTOMIZE cc ON c.CustomerID = cc.CustomerID 
        AND c.Food = cc.Food 
        AND c.CustomID = cc.CustomID 
        AND c.RestaurantName = cc.RestaurantName
        LEFT JOIN CUSTOM_OPTION co ON cc.\`Option\` = co.\`Option\` 
        AND cc.Custom = co.Custom 
        AND cc.RestaurantName = co.RestaurantName
        INNER JOIN MENU m ON c.Food = m.Food 
        AND c.RestaurantName = m.RestaurantName
        WHERE c.restaurantName = ? AND c.customerID = ?
        ORDER BY c.Food, c.CustomID, cc.Custom ASC
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