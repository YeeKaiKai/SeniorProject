const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (food, amount, price, ingredient, description, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let insertSql = 
    `
    INSERT INTO MENU(Food, Amount, Price, Ingredient, Description, RestaurantName)
    VALUES(?, ?, ?, ?, ?, ?)
    `;
    try {
        await connectionTool.query(connection, insertSql, [food, amount, price, ingredient, description, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}