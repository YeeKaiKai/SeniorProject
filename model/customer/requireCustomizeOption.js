const getPool = require("../connectionDB.js");

module.exports = async function (restaurantName, food) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT *
        FROM CUSTOMIZE as C
        NATURAL JOIN CUSTOM_OPTION AS CO
        NATURAL JOIN FOOD_CUSTOM AS FC
        WHERE C.RestaurantName = ?
        AND C.Food = ?
        `;
        const pool = getPool();
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