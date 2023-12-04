const getPool = require('./connectionDB.js');
const connectionTool = require('./connectionTool.js');

module.exports = async function (restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let selectSql = 
    `
    SELECT *
    FROM MENU 
    NATURAL JOIN CUSTOMIZE
    WHERE RestaurantName = ?
    `;
    try {
        let results = await connectionTool.query(connection, selectSql, [restaurantName]);
        connection.release();
        return results;
    } catch(error) {
        connection.release();
        throw error;
    }
}