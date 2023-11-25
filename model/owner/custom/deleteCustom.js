const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');


module.exports = async function (custom, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let deleteSql = 
    `
    DELETE FROM FOOD_CUSTOM
    WHERE Custom = ?
    AND RestaurantName = ?;
    `;
    try {
        await connectionTool.query(connection, deleteSql, [custom, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}