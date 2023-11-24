const getPool = require('../connectionDB.js');
const connectionTool = require('../connectionTool.js');

/**
 * 新增顧客訂單，如果已經有了就會變修改數量。
 * @param {*} customerID 
 * @param {*} totalSum 
 * @param {*} restaurantName
 */

module.exports = async function (customerID, totalSum, restaurantName, orderNote, orderDate, orderTime, forHere, tableNumber, phoneNumber) {
    
    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);

    try {
        await connectionTool.beginTransaction(connection);
        let insertSql =
        `
        INSERT INTO \`ORDER\`(OrderID, TotalSum, RestaurantName, orderNote, OrderDate, OrderTime, ForHere, TableNumber, PhoneNumber)
        SELECT (SELECT 
            IFNULL(MAX(OrderID), 0) + 1 
            FROM \`ORDER\` 
            WHERE RestaurantName = ?), 
        ?, ?, ?, ?, ?, ?, ?
        `;
        await connectionTool.query(connection, insertSql, [restaurantName, totalSum, restaurantName, orderNote, orderDate, orderTime, forHere, tableNumber, phoneNumber]);
        let updateSql = 
        `
        UPDATE \`CART\`
        SET OrderID = (SELECT MAX(OrderID) FROM \`ORDER\`), Confirmed = TRUE
        WHERE CustomerID = ?
        AND RestaurantName = ?
        AND ISNULL(OrderID)
        `;
        await connectionTool.query(connection, updateSql, [customerID, restaurantName]);
        await connectionTool.commit(connection);
        connection.release();
    } catch(error) {
        await connectionTool.rollback(connection);
        connection.release();
        throw error;
    }
}