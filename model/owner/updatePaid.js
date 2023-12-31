const getPool = require('../connectionDB.js');
const connectionTool = require('../connectionTool.js');

module.exports = async function (paid, restaurantName, orderID) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let updateSql =
    `
    UPDATE \`ORDER\`
    SET Paid = ?
    WHERE RestaurantName = ?
    AND OrderID = ?
    `;
    try {
        await connectionTool.query(connection, updateSql, [paid, restaurantName, orderID]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}