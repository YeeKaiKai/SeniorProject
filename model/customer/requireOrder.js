const getPool = require("../connectionDB.js");
const connectionTool = require('../connectionTool.js');

module.exports = async function (restaurantName, customerID) {

    let sql = 
    `
    SELECT *
    FROM CART c
    LEFT JOIN CART_CUSTOMIZE cc 
    ON c.CustomerID = cc.CustomerID 
    AND c.Food = cc.Food 
    AND c.CustomID = cc.CustomID 
    AND c.RestaurantName = cc.RestaurantName
    INNER JOIN \`ORDER\` o 
    ON c.OrderID = o.OrderID 
    WHERE c.RestaurantName = ? AND c.CustomerID = ?
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