const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (customerID, food, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        let sql = 
        `
        DELETE FROM \`CART\`
        WHERE CustomerID = ? AND Food = ? AND RestaurantName = ?
        `;
        await connectionTool.query(connection, sql, [customerID, food, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}