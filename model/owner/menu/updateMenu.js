const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (food, description, quantity, ingredient, price, category, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let updateSql = 
    `
    UPDATE MENU(Food, Description, Quantity, Ingredient, Price, Category, RestaurantName)
    SET Food = ? AND Description = ? AND Quantity = ? AND Ingredient = ? AND Price = ?
    WHERE Food = ? AND Category = ? AND RestaurantName = ?
    `;
    try {
        await connectionTool.query(connection, updateSql, [food, description, quantity, ingredient, price, food, category, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}