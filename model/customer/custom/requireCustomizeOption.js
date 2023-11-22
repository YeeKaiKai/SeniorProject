const getPool = require("../../connectionDB.js");
const connectionTool = require('../../connectionTool.js');

module.exports = async function (restaurantName, food) {

    let sql = 
    `
    SELECT *
    FROM CUSTOMIZE as C
    NATURAL JOIN CUSTOM_OPTION AS CO
    NATURAL JOIN FOOD_CUSTOM AS FC
    WHERE C.RestaurantName = ? 
    AND C.Food = ?
    `;
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        const results = await connectionTool.query(connection, sql, [restaurantName, food]);
        connection.release();
        return results;
    } catch(error) {
        connection.release();
        throw error;
    }
} 