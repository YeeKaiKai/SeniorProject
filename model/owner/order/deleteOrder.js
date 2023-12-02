const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (orderID, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let deleteSql = 
    `
    DELETE FROM \`ORDER\`
    WHERE OrderID = ? AND RestaurantName = ?;
    `;
    try {
        await connectionTool.query(connection, deleteSql, [orderID, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}