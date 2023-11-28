const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (food, category, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let updateSql = 
    `
    DELETE FROM MENU
    WHERE Food = ? AND Category = ? AND RestaurantName = ?
    `;
    try {
        await connectionTool.query(connection, updateSql, [food, category, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}