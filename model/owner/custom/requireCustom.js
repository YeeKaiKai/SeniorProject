const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

/**
 *
 * @param {String} restaurantName
 */
module.exports = async function (restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let seleteSql = 
    `
    SELECT *
    FROM FOOD_CUSTOM
    WHERE RestaurantName = "${restaurantName}";
    `;
    try {
        let results = await connectionTool.query(connection, seleteSql, [restaurantName]);
        connection.release();
        return results;
    } catch(error) {
        connection.release();
        throw error;
    }
}