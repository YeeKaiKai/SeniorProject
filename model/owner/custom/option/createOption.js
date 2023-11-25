const getPool = require('../../../connectionDB.js');
const connectionTool = require('../../../connectionTool.js');

/**
 * Owner Create a new food custom
 * @param {String} custom 
 * @param {*} minOption
 * @param {*} maxOption
 * @param {String} restaurantName
 */
module.exports = async function (custom, option, optionPrice, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        await connectionTool.beginTransaction(connection);
        for (let num = 0; num < option.length; num++) {
            let insertSql = 
            `
            INSERT INTO CUSTOM_OPTION(Custom, \`Option\`, OptionPrice, RestaurantName)
            VALUES(?, ?, ?, ?);
            `;
            await connectionTool.query(connection, insertSql, [custom, option[num], optionPrice[num], restaurantName]);
        }
        connectionTool.commit(connection);
        connection.release();
    } catch(error) {
        connectionTool.rollback(connection);
        connection.release();
        throw error;
    }
}