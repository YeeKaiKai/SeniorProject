const getPool = require("../connectionDB.js");
const connectionTool = require('../connectionTool.js');

module.exports = async function (restaurantName, customerID) {

    let sql = 
    `
    SELECT c.CustomerID, c.Amount, c.Food, c.CustomID, c.RestaurantName, c.Note, c.Confirmed, 
            c.OrderID, cc.Option, cc.Custom, o.TotalSum, o.orderNote, o.OrderDate, o.OrderTime, o.Forhere, o.TableNumber, o.PhoneNumber, o.Paid
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
    WHERE c.restaurantName = ? AND c.Confirmed = TRUE AND c.CustomerID = ?
    ORDER BY o.OrderID, c.Food, cc.custom ASC
    `;
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        const results = await connectionTool.query(connection, sql, [restaurantName, customerID]);
        connection.release();
        return results;
    } catch(error) {
        connection.release();
        throw error;
    }
} 