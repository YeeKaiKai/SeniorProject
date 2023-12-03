const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (food, description, quantity, ingredient, price, category, custom, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let insertMenuSql = 
    `
    INSERT INTO MENU(Food, Description, Quantity, Ingredient, Price, Category, RestaurantName)
    VALUES(?, ?, ?, ?, ?, ?, ?)
    `;
    let customToFoodSql = 
    `
    INSERT INTO CUSTOMIZE(Custom, Food, Category, RestaurantName)
    VALUES(?, ?, ?, ?)
    `;
    try {
        await connectionTool.beginTransaction(connection);
        await connectionTool.query(connection, insertMenuSql, [food, description, quantity, ingredient, price, category, restaurantName]);
        if (custom != null) {
            for (let num = 0; num < custom.length; num++) {
                await connectionTool.query(connection, customToFoodSql, [custom[num], food, category, restaurantName]);
            }
        }
        await connectionTool.commit(connection);
        connection.release();
    } catch(error) {
        await connectionTool.rollback(connection);
        connection.release();
        throw error;
    }
}