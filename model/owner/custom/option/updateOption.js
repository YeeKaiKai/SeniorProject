const getPool = require('../../../connectionDB.js');
const connectionTool = require('../../../connectionTool.js');

/**
 * 新增顧客訂單，如果已經有了就會變修改數量。
 * @param {*} customerID 
 * @param {*} quantity 
 * @param {*} food 
 * @param {*} restaurantName
 */

module.exports = async function (custom, oldOption, newOption, optionPrice, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        await connectionTool.beginTransaction(connection);
        for (let num = 0; num < oldOption.length; num++) {
            let updateSql = 
            `
            UPDATE CUSTOM_OPTION
            SET \`Option\` = ?,
            OptionPrice = ?
            WHERE Custom = ? 
            AND \`Option\` = ?
            AND RestaurantName = ?;
            `;
            await connectionTool.query(connection, updateSql, [newOption[num], optionPrice[num], custom, oldOption[num], restaurantName]);
        }
        connectionTool.commit(connection);
        connection.release();
    } catch(error) {
        connectionTool.rollback(connection);
        connection.release();
        throw error;
    }
}