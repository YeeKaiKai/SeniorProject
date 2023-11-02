const getPool = require('../connectionDB.js');

/**
 * 加入食物至購物車，如果沒點過就直接新稱，若已經點過，先查詢該食物有沒有同樣的客製化，有的話更新訂單數量，沒有的話新增客製化
 * @param {*} amount 
 * @param {*} custom 
 * @param {*} option 
 * @param {*} note
 * @param {*} food
 * @param {*} customerID
 * @param {*} restaurantName
 */

async function getConnection(pool) {
    return new Promise((resolve, reject) => {
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                return reject(conn_err);
            }
            resolve(connection);
        });
    });
}

async function beginTransaction(connection) {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((tran_err) => {
            if (tran_err) {
                return reject(tran_err);
            }
            resolve();
        });
    });
}

async function queryAsync(connection, sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (query_err, results) => {
            if (query_err) {
                return reject(query_err);
            }
            resolve(results);
        });
    });
}

async function rollback(connection) {
    return new Promise((resolve, reject) => {
        connection.rollback();
        resolve();
    })
}

async function commit(connection) {
    return new Promise((resolve, reject) => {
        connection.commit((commit_err) => {
            if (commit_err) {
                return reject(commit_err);
            }
            resolve();
        })
    })
}

module.exports = async function (amount, custom, option, note, food, customerID, restaurantName) {
    
    const pool = getPool();
    const connection = await getConnection(pool);

    try {

        await beginTransaction(connection);
        
        // 此商品是否擁有客製化
        let customizeSql = 
        `
        SELECT COUNT(*) as count
        FROM CUSTOMIZE
        WHERE RestaurantName = ?
        AND Food = ?
        `;
        let ifCustomize = await queryAsync (connection, customizeSql, [restaurantName, food]);

        // 此商品是否已存在購物車
        let checkSql = 
        `
        SELECT COUNT(*) as count, customID
        FROM CART
        WHERE RestaurantName = ?
        AND Food = ?
        AND CustomerID = ?
        `;
        let ifOrdered = await queryAsync(connection, checkSql, [restaurantName, food, customerID]);

        if (ifCustomize[0].count > 0) {
            // 此商品存在客製化
            
            if (ifOrdered[0].count > 0) {
                // 此商品存在購物車
                
                // 檢查是否存在著客製化相同
                // 需要檢查幾筆
                let customIDSql = 
                `
                SELECT COUNT(DISTINCT CustomID) as count 
                FROM CART_CUSTOMIZE 
                WHERE Food = ? 
                AND CustomerID = ? 
                AND RestaurantName = ?
                `
                let customIDCount = await queryAsync(connection, customIDSql, [food, customerID, restaurantName]);
                // 存在同樣客製化之CustomID
                let sameOptionCustomID = null;
                for (let num = 1; num <= customIDCount[0].count; num++) {
                    let haveSameCustomize = true; 
                    // 第 num 筆的 custom 和 option
                    let customizationSql = 
                    `
                    SELECT custom, option
                    FROM CART_CUSTOMIZE
                    WHERE Food = ?
                    AND CustomerID = ?
                    AND RestaurantName = ?
                    AND CustomID = ?
                    `
                    let customization = await queryAsync(connection, customizationSql, [food, customerID, restaurantName, num]);
                    for (let customIndex = 0; customIndex < customization.length; customIndex++) {

                        // 資料庫的custom在傳入的custom的第幾筆
                        let cIndex = custom.indexOf(customization[customIndex].custom);
                        // 該custom有幾組option
                        let countOption = customization.filter(obj => obj.custom === customization[customIndex].custom).length;
                        for (let optionIndex = 0; optionIndex < countOption; optionIndex++) {
                            
                            // 找到對應的custom之option
                            let existOption = customization.map(obj => obj.option);
                            // 確認資料庫之option是否等同於傳入之option
                            let allOptionExist = existOption.every(op => option[cIndex].includes(op));
                            if (!allOptionExist) {
                                // 有option不相同即為不符合
                                haveSameCustomize = false;
                            }
                        }
                    }
                    if (haveSameCustomize == true) {
                        // 符合即找到

                        sameOptionCustomID = num;
                        break;
                    }
                }

                if (sameOptionCustomID != null) {
                    // 購物車存在同樣客製化

                    // 更新該購物車數量
                    let updateSql = 
                    `
                    UPDATE \`CART\` 
                    SET Amount = 
                    (   SELECT Amount 
                        FROM \`CART\` 
                        WHERE CustomID = ? 
                        AND Food = ? 
                        AND CustomerID = ? 
                        AND RestaurantName = ?
                    ) + ? 
                    WHERE CustomID = ? 
                    AND Food = ?
                    AND CustomerID = ? 
                    AND RestaurantName = ?
                    `
                    await queryAsync(connection, updateSql, [sameOptionCustomID, food, customerID, restaurantName, amount, sameOptionCustomID, food, customerID, restaurantName]);
                } else {
                    // 購物車不存在同樣客製化

                    // 插入購物車
                    let insertCartSql = 
                    `
                    INSERT INTO CART(CustomID, Amount, Note, Food, CustomerID, restaurantName)
                    SELECT
                        (SELECT IFNULL(MAX(CustomID), 0) + 1
                        FROM CART 
                        WHERE Food = ?
                        AND CustomerID = ?
                        AND restaurantName = ?),
                    ?, ?, ?, ?, ?`;
                    await queryAsync(connection, insertCartSql, [food, customerID, restaurantName, amount, note, food, customerID, restaurantName]);
                    let insertCustomSql = 
                    `
                    INSERT INTO CART_CUSTOMIZE(CustomID, CustomerID, Food, Option, Custom, RestaurantName) 
                    SELECT (SELECT MAX(CustomID)
                        FROM CART 
                        WHERE Food = ?
                        AND CustomerID = ?
                        AND restaurantName = ?),
                    ?, ?, ?, ?, ?
                    `;
                    for (let customIndex = 0; customIndex < custom.length; customIndex++) {
                        for (let optionIndex = 0; optionIndex < option.length; optionIndex++) {
                            await queryAsync(connection, insertCustomSql, [food, customerID, restaurantName, customerID, food, option[customIndex][optionIndex], custom[customIndex], restaurantName]);
                        }
                    }
                }
            } else {
                // 此商品不存在購物車
                let insertCartSql = 
                `
                INSERT INTO CART(CustomID, Amount, Note, Food, CustomerID, restaurantName)
                SELECT
                    (SELECT IFNULL(MAX(CustomID), 0) + 1
                    FROM CART 
                    WHERE Food = ?
                    AND CustomerID = ?
                    AND restaurantName = ?),
                ?, ?, ?, ?, ?`;
                await queryAsync(connection, insertCartSql, [food, customerID, restaurantName, amount, note, food, customerID, restaurantName]);
                let insertCustomSql = 
                `
                INSERT INTO CART_CUSTOMIZE(CustomID, CustomerID, Food, Option, Custom, RestaurantName) 
                SELECT (SELECT MAX(CustomID)
                    FROM CART 
                    WHERE Food = ?
                    AND CustomerID = ?
                    AND restaurantName = ?),
                ?, ?, ?, ?, ?
                `;
                for (let customIndex = 0; customIndex < custom.length; customIndex++) {
                    for (let optionIndex = 0; optionIndex < option[customIndex].length; optionIndex++) {
                        await queryAsync(connection, insertCustomSql, [food, customerID, restaurantName, customerID, food, option[customIndex][optionIndex], custom[customIndex], restaurantName]);
                    }
                }
            }

        } else {
            // 此商品不存在客製化

            if (ifOrdered[0].count > 0) {
                // 此商品已在購物車
                // 更新數量
                let updateSql = 
                `
                UPDATE \`CART\` 
                SET Amount = 
                (   SELECT Amount 
                    FROM \`CART\` 
                    WHERE CustomID = 1 
                    AND Food = ? 
                    AND CustomerID = ? 
                    AND RestaurantName = ?
                ) + ? 
                WHERE CustomID = 1 
                AND Food = ?
                AND CustomerID = ? 
                AND RestaurantName = ?
                `
                await queryAsync(connection, updateSql, [food, customerID, restaurantName, food, customerID, restaurantName]);
            } else {
                // 此商品不存在購物車
                // 新增至購物車
                let insertSql = 
                `
                INSERT INTO CART(CustomID, Amount, Note, Food, CustomerID, restaurantName)
                VALUES(1, ?, ?, ?, ?, ?)
                `;
                await queryAsync(connection, insertSql, [amount, note, food, customerID, restaurantName]);
            }
        }

        await commit(connection);
        connection.release();
        resolve("Success");
    } catch (error) {
        await rollback(connection);
        connection.release();
        throw error;

    }

}
