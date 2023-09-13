const getPool = require('./connectionDB.js');

module.exports = async function (food, amount, price, ingredient, description, restaurantID, restaurantName) {

    let sql = 
    `
    INSERT INTO MENU(Food, Amount, Price, Ingredient, Description, RestaurantID)
    VALUES("${food}", ${amount}, ${price}, "${ingredient}", "${description}", "${restaurantID}")
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