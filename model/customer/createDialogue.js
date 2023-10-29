const getPool = require('../connectionDB.js');

module.exports = async function (customerID, dialogue, restaurantName) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        INSERT INTO DIALOGUE(CustomerID, Content)
        VALUES("${customerID}", "${dialogue}")
        `;
        const pool = getPool();
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                throw conn_err;
            }
            connection.query(sql, (query_err, results) => {
                if (query_err) {
                    throw query_err;
                }
                resolve(results);
            })
            if (connection) {
                connection.release();
            }
        })
    })
}