const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

/**
 * 
 * 更新客製化大項和其細項
 * 
 * @param {String} oldCustom 
 * @param {String} newCustom 
 * @param {Number} minOption 
 * @param {Number} maxOption 
 * @param {String[]} oldOption 
 * @param {String[]} newOption 
 * @param {Number[]} optionPrice 
 * @param {String} restaurantName 
 */
module.exports = async function (oldCustom, newCustom, minOption, maxOption, oldOption, newOption, optionPrice, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let deleteCustomSql =
    `
    DELETE FROM FOOD_CUSTOM
    WHERE Custom = ?
    AND RestaurantName = ?
    `;
    let insertCustomSql = 
    `
    INSERT INTO FOOD_CUSTOM(Custom, RestaurantName, MinOption, MaxOption)
    VALUES(?, ?, ?, ?);
    `;
    let insertOptionSql = 
    `
    INSERT INTO CUSTOM_OPTION(Custom, \`Option\`, OptionPrice, RestaurantName)
    VALUES(?, ?, ?, ?);
    `;
    try {
        await connectionTool.beginTransaction(connection);
        await connectionTool.query(connection, deleteCustomSql, [oldCustom, restaurantName]);
        await connectionTool.query(connection, insertCustomSql, [newCustom, restaurantName, minOption, maxOption]);
        for (let num = 0; num < newOption.length; num++) {
            await connectionTool.query(connection, insertOptionSql, [newCustom, newOption[num], optionPrice[num], restaurantName]);
        }
        await connectionTool.commit(connection);
        connection.release();
    } catch(error) {
        await connectionTool.rollback(connection);
        connection.release();
        throw error;
    }
}