const getPool = require('../../../connectionDB.js');
const connectionTool = require('../../../connectionTool.js');

module.exports = async function (custom, option, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        let deleteSql = 
        `
        DELETE FROM CUSTOM_OPTION
        WHERE Custom = ?
        AND \`Option\` = ?
        AND RestaurantName = ?
        `;
        await connectionTool.query(connection, deleteSql, [custom, option, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}