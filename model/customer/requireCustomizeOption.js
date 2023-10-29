const getPool = require("../connectionDB.js");

module.exports = async function (restaurantName, food) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT *
        FROM CUSTOMIZE as C
        INNER JOIN CUSTOM_OPTION AS CO
        ON C.RestaurantName = CO.RestaurantName
        AND C.Custom = CO.Custom
        WHERE C.RestaurantName = ?
        AND C.Food = ?
        `;
        const pool = getPool(restaurantName);
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                reject(conn_err);
            } 
            connection.query(sql, [restaurantName, food], (query_err, results) => {
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