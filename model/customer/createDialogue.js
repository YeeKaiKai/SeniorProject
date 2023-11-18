const getPool = require('../connectionDB.js');
const connectionTool = require('../connectionTool.js');

module.exports = async function (customerID, dialogue, restaurantName) {

    let sql = 
    `
    INSERT INTO DIALOGUE(CustomerID, Content)
    VALUES(?, ?)
    `;
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        await connectionTool.query(connection, sql, [customerID, dialogue]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}