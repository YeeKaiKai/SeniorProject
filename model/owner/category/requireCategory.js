const getPool = require("../connectionDB.js");
const connectionTool = require('../connectionTool.js');

module.exports = async function (restaurantName) {

    let sql = 
    `
    SELECT *
    FROM MENU_CATEGORY
    WHERE RestaurantName = ?
    `;
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        const results = await connectionTool.query(connection, sql, [restaurantName]);
        connection.release();
        return results;
    } catch(error) {
        connection.release();
        throw error;
    }
} 