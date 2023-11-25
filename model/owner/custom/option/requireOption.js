const getPool = require('../../../connectionDB.js');
const connectionTool = require('../../../connectionTool.js');

/**
 *
 * @param {String} custom 
 * @param {String} restaurantName
 */
module.exports = async function (custom, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let selectSql = 
    `
    SELECT *
    FROM CUSTOM_OPTION
    WHERE Custom = "${custom}"
    AND RestaurantName = "${restaurantName}";
    `;
    try {
        let results = await connectionTool.query(connection, selectSql, [custom, restaurantName]);
        connection.release();
        return results;
    } catch(error) {
        connection.release();
        throw error;
    }
}