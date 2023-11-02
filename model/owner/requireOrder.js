const getPool = require("../connectionDB.js");

module.exports = async function (restaurantName) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT * 
        FROM \`ORDER\`
        WHERE restaurantName = ?
        `;
        const pool = getPool();
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                reject(conn_err);
            } 
            connection.query(sql, [restaurantName], (query_err, results) => {
                if (query_err) {
                    reject(query_err);
                }
                resolve(results);
            })
            if (connection) {
                connection.release();
            }
        })
    })

} 