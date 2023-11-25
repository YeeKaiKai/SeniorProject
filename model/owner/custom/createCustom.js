const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

/**
 * Owner Create a new food custom
 * @param {String} custom 
 * @param {Integer} minOption
 * @param {Integer} maxOption
 * @param {String} restaurantName
 */
module.exports = async function (custom, minOption, maxOption, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let insertSql = 
    `
    INSERT INTO FOOD_CUSTOM(Custom, RestaurantName, MinOption, MaxOption)
    VALUES(?, ?, ?, ?);
    `;
    try {
        await connectionTool.query(connection, insertSql, [custom, restaurantName, minOption, maxOption]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}