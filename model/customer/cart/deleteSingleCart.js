const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

module.exports = async function (customID, customerID, food, category, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        let sql = 
        `
        DELETE FROM \`CART\`
        WHERE CustomID = ? AND CustomerID = ? AND Food = ? AND Category = ? AND RestaurantName = ?
        `;
        await connectionTool.query(connection, sql, [customID, customerID, food, category, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}