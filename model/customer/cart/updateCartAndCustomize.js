const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');
const _ = require('lodash');

/**
 * 
 * 更新購物車，如果沒有相同的就直接更改客製化或數量
 * 
 * 若存在相同的，直接更新到該筆購物車，並刪除原本的
 * 
 * @param {*} amount 
 * @param {*} custom 
 * @param {*} oldOption 
 * @param {*} newOption 
 * @param {*} oldNote
 * @param {*} newNote
 * @param {*} food
 * @param {*} customerID
 * @param {*} restaurantName
 */

module.exports = async function (amount, custom, oldOption, newOption, oldNote, newNote, food, category, customerID, customID, restaurantName) {
    
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
        if (ifCustomize[0].count > 0) {
            // 此商品存在客製化
            if (_.isEqual(oldOption, newOption) && _.isEqual(oldNote, newNote)) {
                // 沒有更新客製化或備註
    
                // 更新數量、備註
                let updateSql = 
                    `
                    UPDATE \`CART\` 
                    SET Amount = ?, Note = ?
                    WHERE CustomID = ? 
                    AND Food = ?
                    AND Note = ?
                    AND Category = ?
                    AND CustomerID = ? 
                    AND RestaurantName = ?
                    `
                    await connectionTool.query(connection, updateSql, [amount, newNote, customID, food, oldNote, category, customerID, restaurantName]);
            } else {
                // 有更新客製化或備註

                // 檢查是否存在著客製化相同
                // 需要檢查幾筆
                let customIDSql = 
                `
                SELECT COUNT(DISTINCT CustomID) as count 
                FROM CART
                WHERE Food = ? 
                AND Note = ?
                AND CustomerID = ? 
                AND RestaurantName = ?
                `
                let customIDCount = await connectionTool.query(connection, customIDSql, [food, newNote, customerID, restaurantName]);
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
                    AND Note = ?
                    AND CustomerID = ?
                    AND RestaurantName = ?
                    AND CustomID = ?
                    `
                    let customization = await connectionTool.query(connection, customizationSql, [food, newNote, customerID, restaurantName, num]);
                    for (let customIndex = 0; customIndex < customization.length; customIndex++) {
    
                        // 資料庫的custom在傳入的custom的第幾筆
                        let cIndex = custom.indexOf(customization[customIndex].custom);
                        // 傳入的custom含有資料庫的該custom
                        // 該custom有幾組option
                        let countOption = customization.filter(obj => obj.custom === customization[customIndex].custom).length;
                        for (let optionIndex = 0; optionIndex < countOption; optionIndex++) {
                            // 找到對應的custom之option
                            let existOption = customization.filter(obj => obj.custom === custom[cIndex]).map(obj => obj.option);
                            // 確認資料庫之option是否等同於傳入之option
                            let allOptionInParams = existOption.every(op => newOption[cIndex].includes(op));
                            // 確認傳入之option是否等同於資料庫之option
                            let allOptionINDB = newOption[cIndex].every(op => existOption.includes(op));
                            if (!allOptionInParams || !allOptionINDB) {
                                // 有option不相同即為不符合
                                haveSameCustomize = false;
                            }
                        }
                    }
                    if (customization.length == 0 && newOption[0].length == 0) {
                        // 有兩筆「可選、但沒選」的購物車

                        sameOptionCustomID = num;
                        break;
                    } else if (haveSameCustomize == true && customization.length > 0) {
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
                    await connectionTool.query(connection, updateSql, [sameOptionCustomID, food, newNote, category, customerID, restaurantName, amount, sameOptionCustomID, food, newNote, category, customerID, restaurantName]);
                    // 將原購物車數量減至0(刪除)
                    let deleteSql = 
                    `
                    DELETE FROM CART
                    WHERE CustomerID = ? AND CustomID = ? AND Food = ? AND Note = ? AND Category = ? AND RestaurantName = ?
                    `;
                    await connectionTool.query(connection, deleteSql, [customerID, customID, food, oldNote, category, restaurantName]);
    
                } else {
                    // 購物車不存在同樣客製化
    
                    // 更新原購物車 => 刪除舊有的客製化，更新購物車資訊，新增新的客製化
                    let deleteCustomSql = 
                    `
                    DELETE FROM CART_CUSTOMIZE
                    WHERE CustomerID = ? AND Food = ? AND Note = ? AND CustomID = ? AND RestaurantName = ?
                    `;
                    await connectionTool.query(connection, deleteCustomSql, [customerID, food, oldNote, customID, restaurantName]);
                    let updateCartSql = 
                    `
                    UPDATE CART
                    SET Amount = ?, Note = ?
                    WHERE CustomID = ? AND Food= ? AND Note = ? AND Category = ? AND CustomerID = ? AND RestaurantName = ?
                    `;
                    await connectionTool.query(connection, updateCartSql, [amount, newNote, customID, food, oldNote, category, customerID, restaurantName]);
                    let insertCustomSql = 
                    `
                    INSERT INTO CART_CUSTOMIZE(CustomID, CustomerID, Food, Note, Category, Option, Custom, RestaurantName) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    for (let customIndex = 0; customIndex < custom.length; customIndex++) {
                        for (let optionIndex = 0; optionIndex < newOption[customIndex].length; optionIndex++) {
                            await connectionTool.query(connection, insertCustomSql, [customID, customerID, food, newNote, category, newOption[customIndex][optionIndex], custom[customIndex], restaurantName]);
                        }
                    }
                }

            }
        } else {
            // 此商品不存在客製化

            // 更新數量
            let updateSql = 
            `
            UPDATE \`CART\` 
            SET Amount = ? 
            WHERE CustomID = ?
            AND Food = ?
            AND Note = ?
            AND Category = ?
            AND CustomerID = ? 
            AND RestaurantName = ?
            `
            await connectionTool.query(connection, updateSql, [amount, customID, food, oldNote, category, customerID, restaurantName]);
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
