const getPool = require('../connectionDB.js');
const connectionTool = require('../connectionTool.js');

module.exports = async function (customerID, food, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    for (let num = 0; num < food.length; num++) {
        let sql = 
        `
        DELETE FROM \`CART\`
        WHERE CustomerID = ? AND Food = ? AND RestaurantName = ? AND Confirmed = False;
        `;
        await connectionTool.query(connection, sql, [customerID, food[num], restaurantName]);
    }
    connectionTool.release(connection);
}