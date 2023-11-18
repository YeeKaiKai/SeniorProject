const getPool = require("../connectionDB.js");
const connectionTool = require('../connectionTool.js');

module.exports = async function (restaurantName, customerID) {

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
    WHERE c.restaurantName = ? AND c.customerID = ? AND c.Confirmed = FALSE
    ORDER BY c.Food, c.CustomID, cc.Custom ASC
    `;
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        const results = connectionTool.query(connection, sql, [restaurantName, customerID]);
        connectionTool.release(connection);
        return results;
    } catch(error) {
        connectionTool.release(connection);
        throw error;
    }
} 