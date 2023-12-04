const getPool = require('../connectionDB.js');
const connectionTool = require('../connectionTool.js');

/**
 * 店家註冊
 * @param {*} customerID 
 * @param {*} quantity 
 * @param {*} food 
 * @param {*} note
 * @param {*} restaurantName
 */

module.exports = async function (restaurantName, restaurantName_zh_tw, email, enPassword, businessHours, tel, address) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let insertSql =
    `
    INSERT INTO RESTAURANT(RestaurantName, RestaurantName_zh_tw, Email, \`Password\`, BusinessHours, TEL, Address)
    VALUES(?, ?, ?, ?, ?, ?, ?)
    `;
    let selectSql = 
    `
    SELECT *
    FROM RESTAURANT
    WHERE Email = ?;
    `;
    try {
        await connectionTool.beginTransaction(connection);
        let results = await connectionTool.query(connection, selectSql, [email]);
        if (results.length > 0) {
            await connectionTool.commit(connection);
            connection.release();
            return ("此信箱已經註冊過！");
        } else {
            await connectionTool.query(connection, insertSql, [restaurantName, restaurantName_zh_tw, email, enPassword, businessHours, tel, address]);
            await connectionTool.commit(connection);
            connection.release();
            return ("註冊成功！");
        }
    } catch(error) {
        await connectionTool.rollback(connection);
        connection.release();
        throw error;
    }
}