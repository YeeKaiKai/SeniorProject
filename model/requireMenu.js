const getPool = require("../model/connectionDB.js");

module.exports = async function (restaurantID, restaurantName) {
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
        SELECT Food, Description, Quantity, Category, Ingredient, Price
        FROM MENU
        WHERE restaurantID = "${restaurantID}";
        `;
        const pool = getPool(restaurantName);
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                reject(conn_err);
            } 
            connection.query(sql, (query_err, results) => {
                if (query_err) {
                    reject(query_err);
                } 

                // 兩次轉換會變乾淨
                // results = JSON.stringify(results);
                // results = JSON.parse(results);
                // 取出純文字內容
                // let text;
                // for (let i = 0; i < results.length; i++) {
                //     text = text + results[i].Content + "\n";
                // }
                console.log(results)
                resolve(results);
            })
            if (connection) {
                connection.release();
            }
        })
    })

} 