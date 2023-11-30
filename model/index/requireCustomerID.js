const getPool = require("../connectionDB.js");
const connectionTool = require('../connectionTool.js');

module.exports = async function () {

    const pool = getPool();
    const connection = await connectionTool.getConnection(pool);
    try {
        await connectionTool.beginTransaction(connection);
        let insertSql = 
        `
        INSERT INTO CUSTOMER(CustomerID)
        SELECT 
        (SELECT IFNULL(MAX(CustomerID), 0) + 1 as CustomerID
        FROM CUSTOMER 
        UNION
        SELECT 1
        LIMIT 1)
        `;
        await connectionTool.query(connection, insertSql);
        let selectSql = 
        `
        SELECT MAX(CustomerID) as CustomerID
        FROM CUSTOMER
        `;
        let results = await connectionTool.query(connection, selectSql);
        connectionTool.commit(connection);
        connection.release();
        return results;
    } catch(error) {
        connectionTool.rollback(connection);
        connection.release();
        throw error
    }
} 