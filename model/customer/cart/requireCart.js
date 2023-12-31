const getPool = require("../../connectionDB.js");
const connectionTool = require('../../connectionTool.js');

/**
 * 
 * 回傳購物車內容
 * 
 * @param {String} restaurantName 
 * @param {Number} customerID 
 * @returns 
 */
module.exports = async function (restaurantName, customerID) {

    let sql = 
    `
    SELECT c.CustomerID, c.Amount, c.Food, c.Category, c.CustomID, c.RestaurantName, c.Note, c.Confirmed, cc.Option, cc.Custom, m.Price, m.Quantity, co.OptionPrice, fc.MinOption
    FROM CART c
    LEFT JOIN CART_CUSTOMIZE cc ON c.CustomerID = cc.CustomerID 
    AND c.Food = cc.Food 
    AND c.CustomID = cc.CustomID 
    AND c.Note = cc.Note
    AND c.Category = cc.Category
    AND c.RestaurantName = cc.RestaurantName
    LEFT JOIN CUSTOM_OPTION co ON cc.\`Option\` = co.\`Option\` 
    AND cc.Custom = co.Custom 
    AND cc.RestaurantName = co.RestaurantName
    INNER JOIN MENU m ON c.Food = m.Food 
    AND c.RestaurantName = m.RestaurantName
    LEFT JOIN FOOD_CUSTOM fc ON co.Custom = fc.Custom
    AND co.RestaurantName = fc.RestaurantName
    WHERE c.restaurantName = ? AND c.customerID = ? AND c.Confirmed = FALSE
    ORDER BY c.Food, c.CustomID, c.Note, cc.Custom ASC
    `;
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        let results = await connectionTool.query(connection, sql, [restaurantName, customerID]);
        connection.release();
        results = calculateTotal(results);
        return results;
    } catch(error) {
        connection.release();
        throw error;
    }
} 

function calculateTotal(orders) {
    const totals = {};
    
    orders.forEach(order => {
        // 以 CustomID 和 Food 結合作為 key 判斷
        const key = order.CustomID + '_' + order.Food;
        // 檢查該食物是否已存在於 totals 中
        if (!totals[key]) {
            totals[key] = order.Price + (order.OptionPrice || 0);
        } else {
            // 只加上 OptionPrice，因為 Price 已被計算過一次
            totals[key] += (order.OptionPrice || 0);
        }
    });

    orders.forEach(order => {
        const key = order.CustomID + '_' + order.Food;
        order.customIDSum = totals[key];
    });

    return orders;
}
