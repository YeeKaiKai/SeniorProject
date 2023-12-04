const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (oldFood, newFood, description, defaultQuantity, quantity, ingredient, price, oldCategory, newCategory, custom, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let updateMenuSql = 
    `
    UPDATE MENU
    SET Food = ?, Description = ?, DefaultQuantity = ?, Quantity = ?, Ingredient = ?, Category = ?, Price = ?
    WHERE Food = ? AND Category = ? AND RestaurantName = ?
    `;
    let deleteCustomSql = 
    `
    DELETE FROM CUSTOMIZE
    WHERE Food = ? AND Category = ? AND RestaurantName = ?
    `;
    let customToFoodSql = 
    `
    INSERT INTO CUSTOMIZE(Custom, Food, Category, RestaurantName)
    VALUES(?, ?, ?, ?)
    `;
    try {
        connectionTool.beginTransaction(connection);
        await connectionTool.query(connection, updateMenuSql, [newFood, description, defaultQuantity, quantity, ingredient, newCategory, price, oldFood, oldCategory, restaurantName]);
        await connectionTool.query(connection, deleteCustomSql, [oldFood, oldCategory, restaurantName]);
        if (custom != null) {
            for (let num = 0; num < custom.length; num++) {
                await connectionTool.query(connection, customToFoodSql, [custom[num], newFood, newCategory, restaurantName]);
            }
        }
        connectionTool.commit(connection);
        connection.release();
    } catch(error) {
        connectionTool.rollback(connection);
        connection.release();
        throw error;
    }
}