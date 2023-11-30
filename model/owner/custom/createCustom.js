const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

/**
 * 
 * 店家新增客製化選項
 * 
 * @param {String} custom 
 * @param {Integer} minOption
 * @param {Integer} maxOption
 * @param {String[]} option
 * @param {Number[]} optionPrice
 * @param {String} restaurantName
 */
module.exports = async function (custom, minOption, maxOption, option, optionPrice, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);

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
        await connectionTool.query(connection, insertCustomSql, [custom, restaurantName, minOption, maxOption]);
        for (let num = 0; num < option.length; num++) {
            await connectionTool.query(connection, insertOptionSql, [custom, option[num], optionPrice[num], restaurantName]);
        }
        await connectionTool.commit(connection);
        connection.release();
    } catch(error) {
        await connectionTool.rollback(connection);
        connection.release();
        throw error;
    }
}