const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

/**
 * 
 * 刪除客製化大項(如果要)和細項(如果要)
 * 
 * @param {String} custom 
 * @param {String} option 
 * @param {String} restaurantName 
 */
module.exports = async function (custom, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);

    let deleteCustomSql = 
    `
    DELETE FROM FOOD_CUSTOM
    WHERE Custom = ?
    AND RestaurantName = ?;
    `;

    try {
        await connectionTool.query(connection, deleteCustomSql, [custom, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}