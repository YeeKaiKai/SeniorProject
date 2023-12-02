const getPool = require("../../connectionDB.js");
const connectionTool = require('../../connectionTool.js');

module.exports = async function (restaurantName) {
    
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    let selectSql = 
    `
    SELECT c.CustomerID, c.Amount, c.Food, c.CustomID, c.RestaurantName, c.Note, c.Confirmed, c.OrderID, cc.Option, cc.Custom, o.TotalSum, o.orderNote, o.OrderDate, o.OrderTime, o.Forhere, o.TableNumber, o.PhoneNumber, o.Paid, o.OwnerNote, m.Price, co.OptionPrice
    FROM CART c
    LEFT JOIN CART_CUSTOMIZE cc ON c.CustomerID = cc.CustomerID 
    AND c.Food = cc.Food 
    AND c.CustomID = cc.CustomID 
    AND c.RestaurantName = cc.RestaurantName
    LEFT JOIN CUSTOM_OPTION co ON cc.\`Option\` = co.\`Option\` 
    AND cc.Custom = co.Custom 
    AND cc.RestaurantName = co.RestaurantName
    INNER JOIN MENU m ON c.Food = m.Food 
    AND c.RestaurantName = m.RestaurantName
    INNER JOIN \`ORDER\` o ON c.OrderID = o.OrderID 
    AND c.RestaurantName = o.RestaurantName
    WHERE c.restaurantName = ? AND c.Confirmed = TRUE
    ORDER BY o.OrderID, c.Food, cc.custom ASC
    `;
    try {
        let results = await connectionTool.query(connection, selectSql, [restaurantName]);
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
