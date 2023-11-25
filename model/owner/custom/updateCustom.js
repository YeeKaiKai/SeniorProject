const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (oldCustom, newCustom, minOption, maxOption, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let updateSql =
    `
    UPDATE FOOD_CUSTOM
    SET Custom = ?,
    MinOption = ?,
    MaxOption = ?
    WHERE Custom = ?
    AND RestaurantName = ?
    `;
    try {
        await connectionTool.query(connection, updateSql, [newCustom, minOption, maxOption, oldCustom, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}