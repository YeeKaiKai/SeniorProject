const getPool = require('../connectionDB.js');

module.exports = async function (customerID, food, restaurantName) {

    return new Promise((resolve, reject) => {
        for (let num = 0; num < food.length; num++) {
            let sql = 
            `
            DELETE FROM \`CART\`
            WHERE CustomerID = "${customerID}" AND Food = "${food[num]}" AND RestaurantName = "${restaurantName}" AND Confirmed = False;
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
                    resolve(results);
                })
                if (connection) {
                    connection.release();
                }
            })
        }
    }) 
}