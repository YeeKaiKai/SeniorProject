const getPool = require('./connectionDB.js');
const connectionTool = require('./connectionTool.js');

module.exports = async function (restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let selectSql = 
    `
    SELECT *
    FROM MENU
    WHERE RestaurantName = ?
    `;
    try {
        await connectionTool.query(connection, selectSql, [restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}