const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (category, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        let sql = 
        `
        DELETE FROM MENU_CATEGORY
        WHERE Category = ? AND RestaurantName = ?
        `;
        await connectionTool.query(connection, sql, [category, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}