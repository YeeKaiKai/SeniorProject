const getPool = require("./connectionDB.js");
const connectionTool = require('./connectionTool.js');

module.exports = async function (restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let sql = 
    `
    SELECT Food, Description, Quantity, Category, Ingredient, Price
    FROM MENU
    WHERE RestaurantName = ?;
    `;
    try {
        let results = await connectionTool.query(connection, sql, [restaurantName]);
        connection.release();
        return results;
    } catch(error) {
        connection.release();
        throw error;
    }
} 