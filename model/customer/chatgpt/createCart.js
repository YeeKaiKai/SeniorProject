const getPool = require('../../connectionDB.js');
const connectionTool = require('../../connectionTool.js');

/**
 * 藉由 ChatGPT 新增購物車
 * 如果沒有客製化，會直接新增至購物車，需手動點選客製化
 * 如果有客製化，判斷該餐點有無存在，有則更新數量，無則新增
 * @param {*} customerID 
 * @param {*} quantity 
 * @param {*} food 
 * @param {*} restaurantName
 */

module.exports = async function (amount, note, food, customerID, restaurantName) {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        await connectionTool.beginTransaction(connection);
        for (let num = 0; num < amount.length; num++) {

            // 此商品是否擁有客製化
            let customizeSql = 
            `
            SELECT COUNT(*) as count
            FROM CUSTOMIZE
            WHERE RestaurantName = ?
            AND Food = ?
            `;
            let ifCustomize = await connectionTool.query(connection, customizeSql, [restaurantName, food[num]]);
            if (ifCustomize[0].count > 0) {

                // 該食物存在客製化
                let insertSql =
                `
                INSERT INTO \`CART\`(CustomID, Amount, Note, Food, Category, CustomerID, RestaurantName)
                SELECT
                (SELECT IFNULL(MAX(CustomID), 0) + 1
                FROM CART 
                WHERE Food = ?
                AND Category = (SELECT Category FROM MENU WHERE Food = ? AND RestaurantName = ?)
                AND CustomerID = ?
                AND restaurantName = ?),
                ?, ?, ?, (SELECT Category FROM MENU WHERE Food = ? AND RestaurantName = ?), ?, ?
                `;
                await connectionTool.query(connection, insertSql, [food[num], food[num], restaurantName, customerID, restaurantName, amount[num], note, food[num], food[num], restaurantName, customerID, restaurantName]);
            } else {

                // 該食物不存在客製化
                // 檢查是否已存在購物車
                let seleteSql = 
                `
                SELECT COUNT(*) as count, customID
                FROM CART
                WHERE RestaurantName = ?
                AND Food = ?
                AND CustomerID = ?
                AND Confirmed = FALSE
                `;
                let ifOrdered = await connectionTool.query(connection, seleteSql, [restaurantName, food[num], customerID]);
                if (ifOrdered[0].count > 0) {
                    // 已存在購物車
                    let updateSql = 
                    `
                    UPDATE CART
                    SET Amount = 
                    (   SELECT Amount 
                        FROM CART
                        WHERE CustomID = ? 
                        AND Food = ? 
                        AND Category = (SELECT Category FROM MENU WHERE Food = ? AND RestaurantName = ?)
                        AND CustomerID = ? 
                        AND RestaurantName = ?
                    ) + ? 
                    WHERE CustomID = ? 
                    AND Food = ?
                    AND Category = (SELECT Category FROM MENU WHERE Food = ? AND RestaurantName = ?)
                    AND CustomerID = ? 
                    AND RestaurantName = ?
                    `
                    await connectionTool.query(connection, updateSql, [1, food[num], food[num], restaurantName, customerID, restaurantName, amount[num], 1, food[num], food[num], restaurantName, customerID, restaurantName]);
                } else {
                    // 不存在購物車
                    let insertSql =
                    `
                    INSERT INTO \`CART\`(CustomID, Amount, Note, Food, Category, CustomerID, RestaurantName)
                    SELECT
                    (SELECT IFNULL(MAX(CustomID), 0) + 1
                    FROM CART 
                    WHERE Food = ?
                    AND Category = (SELECT Category FROM MENU WHERE Food = ? AND RestaurantName = ?)
                    AND CustomerID = ?
                    AND restaurantName = ?),
                    ?, ?, ?, (SELECT Category FROM MENU WHERE Food = ? AND RestaurantName = ?), ?, ?
                    `;
                    await connectionTool.query(connection, insertSql, [food[num], food[num], restaurantName, customerID, restaurantName, amount[num], note, food[num], food[num], restaurantName, customerID, restaurantName]);
                }
            }
        }
        await connectionTool.commit(connection);
        connection.release();
    } catch(error) {
        await connectionTool.rollback(connection);
        connection.release();
        throw error;
    }
}