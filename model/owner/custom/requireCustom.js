const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

/**
 *
 * 回傳客製化資料
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
    NATURAL JOIN CUSTOM_OPTION
    WHERE RestaurantName = ?;
    `;
    try {
        let results = await connectionTool.query(connection, seleteSql, [restaurantName]);
        await connectionTool.commit(connection);
        connection.release();
        return results;
    } catch(error) {
        await connectionTool.rollback(connection);
        connection.release();
        throw error;
    }
}