const getPool = require("../../connectionDB.js");
const connectionTool = require('../../connectionTool.js');

/**
 * 
 * 回傳購物車內容
 * 
 * @param {String} restaurantName 
 * @param {Number} customerID 
 * @returns 
 */
module.exports = async function (restaurantName, customerID) {

    let sql = 
    `
    SELECT Food, Amount
    FROM CART 
    WHERE restaurantName = ? AND customerID = ? AND Confirmed = FALSE
    ORDER BY Food, CustomID, Note ASC
    `;
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        let results = await connectionTool.query(connection, sql, [restaurantName, customerID]);
        connection.release();
        return results;
    } catch(error) {
        connection.release();
        throw error;
    }
}