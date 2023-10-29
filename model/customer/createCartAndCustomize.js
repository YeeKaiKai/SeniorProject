const getPool = require('../connectionDB.js');

/**
 * 加入食物至購物車，如果沒點過就直接新稱，若已經點過，先查詢該食物有沒有同樣的客製化，有的話更新訂單數量，沒有的話新增客製化
 * @param {*} amount 
 * @param {*} custom 
 * @param {*} option 
 * @param {*} note
 * @param {*} food
 * @param {*} customID
 * @param {*} customerID
 * @param {*} restaurantName
 */

module.exports = async function (amount, custom, option, note, food, customID, customerID, restaurantName) {

    return new Promise((resolve, reject) => {
        const pool = getPool();
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                reject(conn_err);
                return;
            }
            connection.beginTransaction((tran_err) => {
                if (tran_err) {
                    if (connection) {
                        connection.rollback(() => {
                            connection.release();
                            reject(tran_err);
                        })
                        return;
                    }
                } else {
                    // 檢查是否存在同樣客製化購物車之食物
                    let cartSql = `
                    SELECT COUNT(*) AS count
                    FROM CART
                    WHERE Food = ?
                    AND CustomerID = ?
                    AND RestaurantName = ?`;
                    connection.query(cartSql, [food, customerID, restaurantName], (query_err, results) => {
                        if (query_err) {
                            connection.rollback(() => {
                                connection.release();
                                reject(query_err);
                            });
                            return;
                        }
                        // 有幾筆同樣食物之購物車要檢查
                        let promises = [];
                        let countSql = `SELECT COUNT(DISTINCT CustomID) as customIDLength 
                        FROM \`CART_CUSTOMIZE\` 
                        WHERE CustomerID = ? 
                        AND Food = ? 
                        AND RestaurantName = ?`
                        connection.query(countSql, [customerID, food, restaurantName], (query_err, results) => {
                            if (query_err) {
                                connection.rollback(() => {
                                    connection.release();
                                    reject(query_err);
                                })
                                return;
                            }
                            let customIDLength = results[0].customIDLength;
                            if (customIDLength == 0) {
                                // 代表未點過此食物
                                promises.push(new Promise((resolve, reject) => {
                                    resolve({
                                        count: 0
                                    });
                                }))
                            }
                            // 該食物是否存在相同之客製化
                            let checkSql = `SELECT COUNT(*) as count 
                            FROM CART_CUSTOMIZE 
                            WHERE CustomID = ? 
                            AND Food = ? 
                            AND CustomerID = ? 
                            AND Custom = ? 
                            AND \`Option\` = ? 
                            AND RestaurantName = ?`
                            for (let index0 = 1; index0 <= customIDLength; index0++) {
                                for (let index1 = 0; index1 < custom.length; index1++) {
                                    for (let index2 = 0; index2 < option[index1].length; index2++) {
                                        promises.push(new Promise((resolve, reject) => {
                                            connection.query(checkSql, [index0, food, customerID, custom[index1], option[index1][index2], restaurantName], (query_err, results) => {
                                                if (query_err) {
                                                    reject(query_err);
                                                } else {
                                                    resolve(results[0].count);
                                                }
                                            });
                                        }))
                                    }
                                } 
                            }
                            Promise.all(promises).then((counts) => {
                                // 該食物已存在所有客製化組合重複
                                if (counts.every(count => count > 0 )) {
                                    let updateSql = `UPDATE \`CART\` 
                                    SET Amount = 
                                    (SELECT Amount 
                                        FROM \`CART\` 
                                        WHERE CustomID = ? 
                                        AND Food = ? 
                                        AND CustomerID = ? 
                                        AND RestaurantName = ?) 
                                        + ? 
                                        WHERE CustomID = ? 
                                        AND Food = ?
                                        AND CustomerID = ? 
                                        AND RestaurantName = ?`
                                        connection.query(updateSql, [customID, food, customerID, restaurantName, amount, customID, food, customerID, restaurantName], (query_err, results) => {
                                            if (query_err) {
                                            connection.rollback(() => {
                                                console.log(query_err);
                                                reject(query_err);
                                            })
                                        } else {
                                            connection.commit(commit_err => {
                                                if (commit_err) {
                                                    connection.rollback(() => {
                                                        reject(commit_err);
                                                    })
                                                } else {
                                                    resolve(results);
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    // 該客製化食物訂單不存在
                                    // 先新增至購物車
                                    let orderSql = `
                                    INSERT INTO CART(CustomID, Amount, Note, Food, CustomerID, restaurantName)
                                    SELECT
                                        (SELECT IFNULL(MAX(CustomID), 0) + 1
                                        FROM CART 
                                        WHERE FOOD = ?
                                        AND CustomerID = ?
                                        AND restaurantName = ?
                                        UNION
                                        SELECT 0
                                        LIMIT 1),
                                    ?, ?, ?, ?, ?`;
                                    connection.query(orderSql, [food, customerID, restaurantName, amount, note, food, customerID, restaurantName], (query_err, results) => {
                                        if (query_err) {
                                            connection.rollback(() => {
                                                reject(query_err);
                                            }) 
                                        }
                                        // 新增至客製化
                                        let insertSql = `INSERT INTO CART_CUSTOMIZE(customerID, food, customID, option, custom, RestaurantName) 
                                        VALUES (?, ?, ?, ?, ?, ?)`
                                        let _promises = [];
                                        for(let index1 = 0; index1 < custom.length; index1++) {
                                            for(let index2 = 0; index2 < option[index1].length; index2++) {
                                                _promises.push(new Promise((resolve, reject) => {
                                                    connection.query(insertSql, [customerID, food, customID, option[index1][index2], custom[index1], restaurantName], (query_err, results) => {
                                                        if (query_err) {
                                                            reject(query_err);
                                                        } else {
                                                            resolve(results);
                                                        }
                                                    })
                                                }))
                                            }
                                        }
                                        Promise.all(_promises).then(() => {
                                            connection.commit(commit_err => {
                                                if (commit_err) {
                                                    connection.rollback(() => {
                                                        reject(commit_err);
                                                    })
                                                } else {
                                                    resolve("Success");
                                                }
                                            })
                                        }).catch(() => {
                                            connection.rollback(() => {
                                                reject(new Error(500));
                                            })
                                        })
                                    })
                                }
                            }).catch(() => {
                                connection.rollback(() => {
                                    reject(new Error(500));
                                })
                            }).finally(() => {
                                if (connection) {
                                    connection.release();
                                }
                            })
                        })
                    })
                }
            })
        })
    })
}