const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (food, description, quantity, ingredient, price, category, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let insertSql = 
    `
    INSERT INTO MENU(Food, Description, Quantity, Ingredient, Price, Category, RestaurantName)
    VALUES(?, ?, ?, ?, ?, ?)
    `;
    try {
        await connectionTool.query(connection, insertSql, [food, description, quantity, ingredient, price, category, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}