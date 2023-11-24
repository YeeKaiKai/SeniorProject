const getPool = require("../../connectionDB.js");

module.exports = async function (restaurantName) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT c.CustomerID, c.Amount, c.Food, c.CustomID, c.RestaurantName, c.Note, c.Confirmed, 
                c.OrderID, cc.Option, cc.Custom, o.TotalSum, o.OrderDate, o.OrderTime, o.Forhere, o.TableNumber, o.PhoneNumber, o.Paid
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
        INNER JOIN \`ORDER\` o ON c.OrderID = o.OrderID 
        AND c.RestaurantName = o.RestaurantName
        WHERE c.restaurantName = ? AND c.Confirmed = TRUE
        ORDER BY o.OrderID, c.Food, cc.custom ASC
        `;
        const pool = getPool();
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                reject(conn_err);
            } 
            connection.query(sql, [restaurantName], (query_err, results) => {
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