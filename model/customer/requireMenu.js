const getPool = require('../connectionDB.js');
const connectionTool = require('../connectionTool.js');

module.exports = async function (restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let selectSql = 
    `
    SELECT M.Food, M.Description, M.DefaultQuantity, M.Quantity, M.Ingredient, M.Price, M.Category, M.RestaurantName
    FROM MENU 
    WHERE RestaurantName = ?
    `;
    try {
        let results = await connectionTool.query(connection, selectSql, [restaurantName]);
        connection.release();
        return results;
    } catch(error) {
        connection.release();
        throw error;
    }
}