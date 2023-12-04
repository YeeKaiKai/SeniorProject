const getPool = require("../../connectionDB.js");
const connectionTool = require('../../connectionTool.js');

module.exports = async function (customerID, restaurantName) {

    let sql = 
    `
    SELECT Content
    FROM DIALOGUE
    WHERE CustomerID = ?
    AND RestaurantName = ?
    AND DialogueID IN 
    (
        SELECT DISTINCT MAX(DialogueID)
        FROM DIALOGUE
        WHERE CustomerID = ?
        AND RestaurantName = ?
    )
    `;
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        const results = await connectionTool.query(connection, sql, [customerID, restaurantName, customerID, restaurantName]);
        connection.release();
        return results;
    } catch(error) {
        connection.release();
        throw error;
    }
} 