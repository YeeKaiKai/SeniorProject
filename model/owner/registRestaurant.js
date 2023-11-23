const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

/**
 * 店家註冊
 * @param {*} customerID 
 * @param {*} quantity 
 * @param {*} food 
 * @param {*} note
 * @param {*} restaurantName
 */

module.exports = async function (restaurantName, restaurantName_zh_tw, email, enPassword, businessHours, tel) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let sql =
    `
    INSERT INTO RESTAURANT(RestaurantName, RestaurantName_zh_tw, Email, \`Password\`, BusinessHours, TEL)
    VALUES(?, ?, ?, ?, ?, ?)
    `;
    try {
        await connectionTool.query(connection, sql, [restaurantName, restaurantName_zh_tw, email, enPassword, businessHours, tel]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}