const getPool = require("../connectionDB.js");

module.exports = async function (customerID, restaurantName) {
    // let sql = 
    // `
    // SELECT Content
    // FROM DIALOGUE
    // WHERE customerID = "${customerID}"
    // `;
    // pool.getConnection((conn_err, connection) => {
    //     if (conn_err) {
    //         throw conn_err;
    //     } 
    //     connection.query(sql, (query_err, results) => {
    //         if (query_err) {
    //             throw query_err;
    //         }
    //         // 兩次轉換會變乾淨
    //         results = JSON.stringify(results);
    //         results = JSON.parse(results);

    //         // 取出純文字內容
    //         let test;
    //         for (let i = 0; i < results.length; i++) {
    //             test = test + results[i].Content + "\n";
    //         }
    //         console.log(results);
    //         return results;
    //     })
    //     if (connection) {
    //         connection.release();
    //     }
    // })

    // ----------------------------

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT Content
        FROM DIALOGUE
        WHERE customerID = "${customerID}"
        `;
        const pool = getPool();
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                reject(conn_err);
            } 
            connection.query(sql, (query_err, results) => {
                if (query_err) {
                    reject(query_err);
                } 

                // 兩次轉換會變乾淨
                results = JSON.stringify(results);
                results = JSON.parse(results);
                
                // 取出純文字內容
                let text = "";
                
                // 只取最近五次的對話紀錄
                if (results.length !== 0) {
                    let start = (results.length - 5) >= 0 ? results.length - 5 : 0;
                    let end = (results.length - 5) >= 0 ? 5 : results.length;
                    for (let i = 0; i < end; i++) {
                        text = text + results[start + i].Content + "\n";
                    }
                }
                resolve(text);
            })
            if (connection) {
                connection.release();
            }
        })
    })

} 