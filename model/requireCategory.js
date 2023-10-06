const getPool = require("../model/connectionDB.js");

module.exports = async function (restaurantID, restaurantName) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT DISTINCT Category
        FROM MENU;
        `;
        const pool = getPool(restaurantName);
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                reject(conn_err);
            } 
            connection.query(sql, (query_err, results) => {
                if (query_err) {
                    reject(query_err);
                } 

                // 兩次轉換會變乾淨
                results = JSON.stringify(results);
                results = JSON.parse(results);

                resolve(results);
            })
            if (connection) {
                connection.release();
            }
        })
    })

} 