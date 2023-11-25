const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

/**
 * 新增菜單的類別
 * @param {*} category
 * @param {*} restaurantName
 */

module.exports = async function (category, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let sql =
    `
    INSERT INTO MENU_CATEGORY(Category, MenuAmount, RestaurantName)
    VALUES ?, ?, ?
    `;
    try {
        await connectionTool.query(connection, sql, [category, 0, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}