const getPool = require('../connectionDB.js');

/**
 * 先查詢該食物有沒有同樣的客製化，有的話更新訂單數量，沒有的話新增客製化
 * @param {*} amount 
 * @param {*} custom 
 * @param {*} option 
 * @param {*} food
 * @param {*} customID
 * @param {*} customerID
 * @param {*} restaurantName
 */

module.exports = async function (amount, custom, option, food, customID, customerID, restaurantName) {

    const pool = getPool(restaurantName);
    pool.getConnection((conn_err, connection) => {
        if (conn_err) {
            throw conn_err;
        }
        connection.beginTransaction((tran_err) => {
            if (tran_err) {
                if (connection) {
                    connection.rollback(() => {
                        connection.release();
                        throw tran_err;
                    })
                }
            } else {

                // 有幾筆該食物的訂單
                let promises = [];
                let countSql = `SELECT COUNT(DISTINCT CustomID) as customIDLength 
                FROM \`CART_CUSTOMIZE\` 
                WHERE CustomerID = ? 
                AND Food = ? 
                AND Custom = ? 
                AND \`Option\` = ? 
                AND RestaurantName = ?`
                connection.query(countSql, [customerID, food, custom, option, restaurantName], (query_err, results) => {
                    if (query_err) {
                        if (connection) {
                            connection.rollback(() => {
                                connection.release();
                                throw query_err;
                            })
                        }
                    }
                    let customIDLength = results[0].customIDLength;

                    // 先看該食物是否存在相同之客製化
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
                            for (let index2 = 0; index2 < option.length; index2++) {
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
                })
                
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
                                    throw query_err;
                                })
                            } else {
                                connection.commit(commit_err => {
                                    if (commit_err) {
                                        connection.rollback(() => {
                                            throw commit_err;
                                        })
                                    } else {
                                        return results;
                                    }
                                })
                            }
                        })
                    } else {
                        // 該客製化食物訂單不存在
                        let insertSql = `INSERT INTO CART_CUSTOMIZE(customerID, food, customID, option, custom, RestaurantName) 
                        VALUES (?, ?, ?, ?, ?, ?)`
                        let _promises = [];
                        for(let index1 = 0; index1 < custom.length; index1++) {
                            for(let index2 = 0; index2 < option.length; index2++) {
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
                                        throw commit_err;
                                    })
                                } else {
                                    return;
                                }
                            })
                        }).catch(() => {
                            connection.rollback(() => {
                                throw Error(500);
                            })
                        }).finally(() => {
                            if (connection) {
                                connection.release();
                            }
                        })
                    }
                }).catch(() => {
                    connection.rollback(() => {
                        throw Error(500);
                    })
                }).finally(() => {
                    if (connection) {
                        connection.release();
                    }
                })
            }
        })
    })
}