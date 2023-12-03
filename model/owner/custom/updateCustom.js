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
    let updateCustomSql =
    `
    UPDATE FOOD_CUSTOM
    SET Custom = ?,
    MinOption = ?,
    MaxOption = ?
    WHERE Custom = ?
    AND RestaurantName = ?
    `;
    let updateOptionSql = 
    `
    UPDATE CUSTOM_OPTION
    SET Option = ?,
    OptionPrice = ?
    WHERE Custom = ?
    AND Option = ?
    AND RestaurantName = ?
    `
    try {
        await connectionTool.beginTransaction(connection);
        await connectionTool.query(connection, updateCustomSql, [newCustom, minOption, maxOption, oldCustom, restaurantName]);
        for (let num = 0; num < newOption.length; num++) {
            await connectionTool.query(connection, updateOptionSql, [newOption[num], optionPrice[num], oldOption[num], oldCustom, oldOption[num], restaurantName]);
        }
        await connectionTool.commit(connection);
        connection.release();
    } catch(error) {
        await connectionTool.rollback(connection);
        connection.release();
        throw error;
    }
}