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
    await connectionTool.query(connection, sql, [customerID, dialogue]);
    connectionTool.release(connection);
}