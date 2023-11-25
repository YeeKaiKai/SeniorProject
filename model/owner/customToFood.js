const getPool = require('../connectionDB.js');
const connectionTool = require('../connectionTool.js');

/**
 * Owner Create a new food custom
 * @param {String} custom 
 * @param {Object[]} option 
 * @param {Object[]} price
 */
module.exports = async function (custom, food, restaurantName) {

    const pool = getPool(restaurantName);
    const connection = await connectionTool.getConnection(pool);
    try {
        await connectionTool.beginTransaction(connection);
        for (let num = 0; num < custom.length; num++) {
            let insertSql = 
            `
            INSERT INTO CUSTOMIZE(Custom, Food, RestaurantName)
            VALUES(?, ?, ?)
            `;
            await connectionTool.query(connection, insertSql, [custom[num], food, restaurantName]);
        }
        connectionTool.commit(connection);
        connection.release();
    } catch(error) {
        connectionTool.rollback(connection);
        connection.release();
        throw error;
    }
}