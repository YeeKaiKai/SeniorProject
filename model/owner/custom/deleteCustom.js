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
module.exports = async function (custom, option, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);

    let deleteOptionSql = 
    `
    DELETE FROM CUSTOM_OPTION
    WHERE Option = ?
    AND RestaurantName = ?
    `;
    let deleteCustomSql = 
    `
    DELETE FROM FOOD_CUSTOM
    WHERE Custom = ?
    AND RestaurantName = ?;
    `;

    try {
        await connectionTool.beginTransaction(connection);
        for (let num = 0; num < option.length; num++) {
            await connectionTool.query(connection, deleteOptionSql, [custom, option[num], restaurantName]);
        }
        await connectionTool.query(connection, deleteCustomSql, [custom, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}