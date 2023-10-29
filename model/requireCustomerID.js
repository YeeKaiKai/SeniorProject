const getPool = require("./connectionDB.js");

module.exports = async function () {

    return new Promise((resolve, reject) => {
        const pool = getPool();
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                reject(conn_err);
                return;
            } 
            connection.beginTransaction((tran_err) => {
                if (tran_err) {
                    connection.rollback(() => {
                        connection.release();
                        reject(tran_err);
                        return;
                    });
                } 
                let insertSql = `
                INSERT INTO CUSTOMER(CustomerID)
                SELECT 
                    (SELECT IFNULL(MAX(CustomerID), 0) + 1 as CustomerID
                    FROM CUSTOMER 
                    UNION
                    SELECT 1
                    LIMIT 1)`;
                connection.query(insertSql, (query_err, results) => {
                    if (query_err) {
                        connection.rollback(() => {
                            connection.release();
                            reject(query_err);
                            return;
                        });
                    }
                    let selectSql = `SELECT MAX(CustomerID) as CustomerID
                    FROM CUSTOMER`;
                    connection.query(selectSql, (query_err, results) => {
                        if (query_err) {
                            connection.rollback(() => {
                                reject(query_err);
                            });
                        }
                        connection.commit((commit_err) => {
                            if (commit_err) {
                                connection.rollback(() => {
                                    connection.release();
                                    reject(query_err);
                                    return;
                                });
                            }
                            resolve(results);
                        })
                    })
                })
            })
        })
    })

} 