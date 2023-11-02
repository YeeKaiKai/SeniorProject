const getPool = require('../connectionDB.js');

/**
 * 新增顧客訂單，如果已經有了就會變修改數量。
 * @param {*} customerID 
 * @param {*} totalSum 
 * @param {*} restaurantName
 */

module.exports = async function (customerID, totalSum, restaurantName, orderDate, orderTime, forHere, tableNumber, phoneNumber) {
    
    let sql =
    `
    UPDATE \`CART\` 
    SET Confirmed = TRUE,
    OrderID = ?
    WHERE CustomerID = ? 
    AND RestaurantName = ?
    `;
    return new Promise((resolve, reject) => {
        
        const pool = getPool();
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                connection.release();
                reject(conn_err);
                return;
            }
            connection.beginTransaction((tran_err) => {
                if (tran_err) {
                    connection.rollback(() => {
                        connection.release();
                        reject(tran_err);
                        return;
                    });
                }
                let insertSql =
                `
                INSERT INTO \`ORDER\`(OrderID, TotalSum, RestaurantName, OrderDate, OrderTime, ForHere, TableNumber, PhoneNumber)
                SELECT (SELECT 
                    IFNULL(MAX(OrderID), 0) + 1 
                    FROM \`ORDER\` 
                    WHERE RestaurantName = ?), 
                ?, ?, ?, ?, ?, ?, ?
                `;
                connection.query(insertSql, [restaurantName, totalSum, restaurantName, orderDate, orderTime, forHere, tableNumber, phoneNumber], (query_err, results) => {
                    if (query_err) {
                        connection.rollback(() => {
                            connection.release();
                            reject(query_err);
                            return;
                        });
                    }
                    let updateSql = 
                    `
                    UPDATE \`CART\`
                    SET OrderID = (SELECT MAX(OrderID) FROM \`ORDER\`)
                    WHERE CustomerID = ?
                    AND RestaurantName = ?
                    `;
                    connection.query(updateSql, [customerID, restaurantName], (query_err, results) => {
                        if (query_err) {
                            connection.rollback(() => {
                                connection.release();
                                reject(query_err);
                                return;
                            })
                        }
                        connection.commit((commit_err) => {
                            if (commit_err) {
                                connection.rollback(() => {
                                    connection.release();
                                    reject(commit_err);
                                    return;
                                })
                            }
                            connection.release();
                            resolve(results);
                            return;
                        })
                    })
                })
            })
        })
    })
}