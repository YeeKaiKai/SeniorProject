const getPool = require('../connectionDB.js');

module.exports = async function (customerID, dialogue, restaurantName) {

    let sql = 
    `
    INSERT INTO DIALOGUE(CustomerID, Content)
    VALUES("${customerID}", "${dialogue}")
    `;
    const pool = getPool(restaurantName);
    pool.getConnection((conn_err, connection) => {
        if (conn_err) {
            throw conn_err;
        }
        connection.query(sql, (query_err, results) => {
            if (query_err) {
                throw query_err;
            }
            return results;
        })
        if (connection) {
            connection.release();
        }
    })
}