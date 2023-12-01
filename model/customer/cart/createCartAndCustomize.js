const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

/**
 * 加入食物至購物車，如果沒點過就直接新稱
 * 
 * 若已經點過，先查詢該食物有沒有同樣的客製化
 * 
 * 有的話更新訂單數量，沒有的話新增客製化
 * 
 * @param {Number} amount 
 * @param {[]} custom 
 * @param {[[]]} option 
 * @param {String} note
 * @param {String} food
 * @param {String} category
 * @param {Number} customerID
 * @param {String} restaurantName
 */

module.exports = async function (amount, custom, option, note, food, category, customerID, restaurantName) {
    
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);

    try {

        await connectionTool.beginTransaction(connection);
        
        // 此商品是否擁有客製化
        let customizeSql = 
        `
        SELECT COUNT(*) as count
        FROM CUSTOMIZE
        WHERE RestaurantName = ?
        AND Food = ?
        `;
        let ifCustomize = await connectionTool.query(connection, customizeSql, [restaurantName, food]);

        // 此商品是否已存在購物車
        let checkSql = 
        `
        SELECT COUNT(*) as count, customID
        FROM CART
        WHERE RestaurantName = ?
        AND Food = ?
        AND Note = ?
        AND CustomerID = ?
        AND Confirmed = FALSE
        `;
        let ifOrdered = await connectionTool.query(connection, checkSql, [restaurantName, food, note, customerID]);

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
                NATURAL JOIN CART
                WHERE Food = ? 
                AND Note = ?
                AND CustomerID = ? 
                AND RestaurantName = ?
                `
                let customIDCount = await connectionTool.query(connection, customIDSql, [food, note, customerID, restaurantName]);
                // 存在同樣客製化之CustomID
                let sameOptionCustomID = null;
                for (let num = 1; num <= customIDCount[0].count; num++) {
                    let haveSameCustomize = true; 
                    // 第 num 筆的 custom 和 option
                    let customizationSql = 
                    `
                    SELECT custom, option
                    FROM CART_CUSTOMIZE 
                    NATURAL JOIN CART
                    WHERE Food = ?
                    AND Note = ?
                    AND CustomerID = ?
                    AND RestaurantName = ?
                    AND CustomID = ?
                    AND Confirmed = FALSE
                    `
                    let customization = await connectionTool.query(connection, customizationSql, [food, note, customerID, restaurantName, num]);
                    for (let customIndex = 0; customIndex < customization.length; customIndex++) {

                        // 資料庫的custom在傳入的custom的第幾筆
                        let cIndex = custom.indexOf(customization[customIndex].custom);
                        // 該custom有幾組option
                        let countOption = customization.filter(obj => obj.custom === customization[customIndex].custom).length;
                        for (let optionIndex = 0; optionIndex < countOption; optionIndex++) {
                            
                            // 找到對應的custom之option
                            let existOption = customization.map(obj => obj.option);
                            // 確認資料庫之option是否等同於傳入之option
                            let allOptionInParams = existOption.every(op => option[cIndex].includes(op));
                            // 確認傳入之option是否等同於資料庫之option
                            let allOptionINDB = option[cIndex].every(op => existOption.includes(op));
                            if (!allOptionInParams || !allOptionINDB) {
                                // 有option不相同即為不符合
                                haveSameCustomize = false;
                            }
                        }
                    }
                    if (haveSameCustomize == true && customization.length > 0) {
                        // 符合，且該筆存在客製化

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
                        AND Note = ?
                        AND Category = ?
                        AND CustomerID = ? 
                        AND RestaurantName = ?
                    ) + ? 
                    WHERE CustomID = ? 
                    AND Food = ?
                    AND Note = ?
                    AND Category = ?
                    AND CustomerID = ? 
                    AND RestaurantName = ?
                    `
                    await connectionTool.query(connection, updateSql, [sameOptionCustomID, food, note, category, customerID, restaurantName, amount, sameOptionCustomID, food, note, category, customerID, restaurantName]);
                } else {
                    // 購物車不存在同樣客製化

                    // 插入購物車
                    let insertCartSql = 
                    `
                    INSERT INTO CART(CustomID, Amount, Note, Food, Category, CustomerID, RestaurantName)
                    SELECT
                        (SELECT IFNULL(MAX(CustomID), 0) + 1
                        FROM CART 
                        WHERE Food = ?
                        AND Note = ?
                        AND Category = ?
                        AND CustomerID = ?
                        AND restaurantName = ?),
                    ?, ?, ?, ?, ?, ?`;
                    await connectionTool.query(connection, insertCartSql, [food, note, category, customerID, restaurantName, amount, note, food, category, customerID, restaurantName]);
                    let insertCustomSql = 
                    `
                    INSERT INTO CART_CUSTOMIZE(CustomID, CustomerID, Food, Note, Category, Option, Custom, RestaurantName) 
                    SELECT (SELECT MAX(CustomID)
                        FROM CART 
                        WHERE Food = ?
                        AND Note = ?
                        AND Category = ?
                        AND CustomerID = ?
                        AND restaurantName = ?),
                    ?, ?, ?, ?, ?, ?, ?
                    `;
                    for (let customIndex = 0; customIndex < custom.length; customIndex++) {
                        for (let optionIndex = 0; optionIndex < option[customIndex].length; optionIndex++) {
                            await connectionTool.query(connection, insertCustomSql, [food, note, category, customerID, restaurantName, customerID, food, note, category, option[customIndex][optionIndex], custom[customIndex], restaurantName]);
                        }
                    }
                }
            } else {
                // 此商品不存在購物車
                let insertCartSql = 
                `
                INSERT INTO CART(CustomID, Amount, Note, Food, Category, CustomerID, restaurantName)
                SELECT
                    (SELECT IFNULL(MAX(CustomID), 0) + 1
                    FROM CART 
                    WHERE Food = ?
                    AND Note = ?
                    AND Category = ?
                    AND CustomerID = ?
                    AND restaurantName = ?),
                ?, ?, ?, ?, ?, ?`;
                await connectionTool.query(connection, insertCartSql, [food, note, category, customerID, restaurantName, amount, note, food, category, customerID, restaurantName]);
                let insertCustomSql = 
                `
                INSERT INTO CART_CUSTOMIZE(CustomID, CustomerID, Food, Note, Category, Option, Custom, RestaurantName) 
                SELECT (SELECT MAX(CustomID)
                    FROM CART 
                    WHERE Food = ?
                    AND Note = ?
                    AND Category = ?
                    AND CustomerID = ?
                    AND restaurantName = ?),
                ?, ?, ?, ?, ?, ?, ?
                `;
                for (let customIndex = 0; customIndex < custom.length; customIndex++) {
                    for (let optionIndex = 0; optionIndex < option[customIndex].length; optionIndex++) {
                        await connectionTool.query(connection, insertCustomSql, [food, note, category, customerID, restaurantName, customerID, food, note, category, option[customIndex][optionIndex], custom[customIndex], restaurantName]);
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
                    WHERE CustomID = (SELECT CustomID FROM CART WHERE Food = ? AND Note = ? AND Category = ? AND CustomerID = ? AND RestaurantName = ? AND Confirmed = FALSE) 
                    AND Food = ? 
                    AND Note = ?
                    AND Category = ?
                    AND CustomerID = ? 
                    AND RestaurantName = ?
                ) + ? 
                WHERE CustomID = (SELECT CustomID FROM CART WHERE Food = ? AND Note = ? AND Category = ? AND CustomerID = ? AND RestaurantName = ? AND Confirmed = FALSE)
                AND Food = ?
                AND Note = ?
                AND Category = ?
                AND CustomerID = ? 
                AND RestaurantName = ?
                `
                await connectionTool.query(connection, updateSql, [food, note, category, customerID, restaurantName, food, note, category, customerID, restaurantName, amount, food, note, category, customerID, restaurantName, food, note, category, customerID, restaurantName]);
            } else {
                // 此商品不存在購物車
                // 新增至購物車
                let insertSql = 
                `
                INSERT INTO CART(CustomID, Amount, Note, Food, Category, CustomerID, restaurantName)
                SELECT
                    (SELECT IFNULL(MAX(CustomID), 0) + 1
                    FROM CART 
                    WHERE Food = ?
                    AND Note = ?
                    AND Category = ?
                    AND CustomerID = ?
                    AND restaurantName = ?),
                ?, ?, ?, ?, ?, ?
                `;
                await connectionTool.query(connection, insertSql, [food, note, category, customerID, restaurantName, amount, note, food, category, customerID, restaurantName]);
            }
        }

        await connectionTool.commit(connection);
        connection.release();
    } catch (error) {
        console.log(error);
        await connectionTool.rollback(connection);
        connection.release();
        throw error;
    }

}
