const getPool = require('./connectionDB.js');

module.exports = async function (customerID, food, restaurantID, restaurantName) {

    let sql = 
    `
    DELETE FROM \`ORDER\`
    WHERE CustomerID = "${customerID}" AND Food = "${food}" AND RestaurantID = "${restaurantID}";
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