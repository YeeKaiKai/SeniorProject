const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (newCategory, oldCategory, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        let sql = 
        `
        UPDATE MENU_CATEGORY
        SET Category = ?
        WHERE Category = ? 
        `;
        await connectionTool.query(connection, sql, [newCategory, oldCategory, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}