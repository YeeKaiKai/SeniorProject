const getPool = require('./connectionDB.js');
const connectionTool = require('./connectionTool.js');

module.exports = async function (name, forHere, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let insertSql = 
    `
    INSERT INTO CUSTOMER(Name, ForHere, RestaurantName)
    VALUES("${name}", "${forHere}", "${restaurantName}")
    `;
    try {
        await connectionTool.query(connection, insertSql, [name, forHere, restaurantName]);
        connection.release();
    } catch(error) {
        connection.release();
        throw error;
    }
}