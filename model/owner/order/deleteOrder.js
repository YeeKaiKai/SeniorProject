const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (customerID, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let deleteSql = 
    `
    DELETE FROM \`ORDER\`
    WHERE CustomerID = ? AND RestaurantName = ?;
    `;
    try {
        await connectionTool.query(connection, deleteSql, [customerID, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}